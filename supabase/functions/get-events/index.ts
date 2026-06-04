import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const STALE_MS = 15 * 24 * 60 * 60 * 1000;

const prompt =
  'List major tech events (conferences, fairs, trade shows) in Europe and USA for 2026. Return ONLY raw HTML code without any explanatory text, comments, or markdown. Start directly with <ul> and end with </ul>. Each <li> must follow this exact format: Month Day Year, Event Name, City, event_url. Example: <li>January 6-9 2026, CES, Las Vegas, https://ces.tech</li>. Use English only. Do not include any text before <ul> or after </ul>.';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

serve(async (req) => {
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

    // 1. Check cache
    const { data: cached, error: cacheError } = await supabase
      .from("events_cache")
      .select("raw_data, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cacheError) throw cacheError;

    if (cached) {
      const age = Date.now() - new Date(cached.created_at).getTime();
      if (age < STALE_MS) {
        console.log("📦 Events from cache (raw)");
        return new Response(JSON.stringify(cached.raw_data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 2. Fetch raw text from Gemini API
    console.log("🌐 Fetching events from Gemini API");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // 3. Cache raw text
    await supabase.from("events_cache").delete().gt("id", 0);

    const { error: insertError } = await supabase
      .from("events_cache")
      .insert({ raw_data: { text: rawText } });

    if (insertError) throw insertError;

    console.log("✅ Events cached (raw)");

    return new Response(JSON.stringify({ text: rawText }), {
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
