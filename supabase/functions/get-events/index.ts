import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const STALE_TIMES = {
  EVENTS: 15 * 24 * 60 * 60 * 1000,
} as const;

// Tipos
interface EventProps {
  title: string;
  location: string;
  date: string;
  url: string;
}

const prompt =
  'List major tech events (conferences, fairs, trade shows) in Europe and USA for 2026. Return ONLY raw HTML code without any explanatory text, comments, or markdown. Start directly with <ul> and end with </ul>. Each <li> must follow this exact format: Month Day Year, Event Name, City, event_url. Example: <li>January 6-9 2026, CES, Las Vegas, https://ces.tech</li>. Use English only. Do not include any text before <ul> or after </ul>.';

// Validar frescura del caché
const isCacheFresh = (updatedAt: string, staleTime: number): boolean => {
  const now = new Date().getTime();
  const cacheTime = new Date(updatedAt).getTime();
  return now - cacheTime < staleTime;
};

// Parsear strings de eventos
const parseEventStrings = (events: string[]): EventProps[] => {
  return events.map((str) => {
    const [date, title, location, url] = str.split(",").map((s) => s?.trim());
    return {
      title: title || "",
      location: location || "",
      date: date || "",
      url: url || "",
    };
  });
};

// Mapear HTML a strings
const mapEvents = (data: string): string[] => {
  const ulStart = data.indexOf("<ul>");
  const ulEnd = data.indexOf("</ul>");

  if (ulStart === -1 || ulEnd === -1) {
    console.error("No se encontró estructura <ul></ul> válida");
    return [];
  }

  const mappedEvents = data.substring(ulStart + 4, ulEnd);

  const liRegex = /<li>(.*?)<\/li>/gi;
  const matches = mappedEvents.matchAll(liRegex);

  const listItems = Array.from(matches)
    .map((match) => match[1]?.trim() ?? "")
    .filter((item) => {
      if (!item || item.length < 10) return false;
      const hasDateFormat = /^[A-Za-z]+\s+\d/.test(item);
      return hasDateFormat;
    });

  return listItems;
};

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

serve(async (req) => {
  // Manejar preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST" && req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Verificar caché
    const { data: cachedRows, error: cacheError } = await supabase
      .from("events_cache")
      .select("*")
      .order("updated_at", { ascending: false });

    if (cacheError) throw cacheError;

    if (cachedRows && cachedRows.length > 0) {
      const mostRecent = cachedRows[0];

      if (isCacheFresh(mostRecent.updated_at, STALE_TIMES.EVENTS)) {
        console.log("📦 Events from cache");

        const projectedEvents = cachedRows.map(
          ({ title, location, date, url }: any) => ({
            title,
            location,
            date,
            url,
          })
        );

        return new Response(JSON.stringify(projectedEvents), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 2. Fetch from Gemini API
    console.log("🌐 Fetching events from Gemini API");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawHtml = response.text();

    const eventStrings = mapEvents(rawHtml);
    const parsed = parseEventStrings(eventStrings);

    // 3. Save to cache
    if (parsed && parsed.length > 0) {
      const eventsToCache = parsed.map((event) => ({
        ...event,
        source: "gemini",
        fetch_count: 1,
      }));

      await supabase.from("events_cache").delete().neq("id", 0);

      const { error: insertError } = await supabase
        .from("events_cache")
        .insert(eventsToCache);

      if (insertError) throw insertError;

      console.log("✅ Events saved to cache");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in get-events:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});