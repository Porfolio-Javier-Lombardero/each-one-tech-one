import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const TECHCRUNCH_API_KEY = Deno.env.get("TECHCRUNCH_API_KEY");
const GUARDIAN_API_KEY = Deno.env.get("GUARDIAN_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const STALE_MS = 5 * 60 * 60 * 1000;

// Date range helpers — tied to external API param formats, stay server-side
const todayEnd = (): string => new Date().toISOString();

const todayStart = (): string => {
  const date = new Date();
  date.setUTCHours(date.getUTCHours() - 26);
  return date.toISOString();
};

const yesterdayStart = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

const yesterdayEnd = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

const lastWeekStart = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 9);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

const lastWeekEnd = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 2);
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

const getDateRange = (filter: string): { after: string; before: string } => {
  switch (filter) {
    case "all":
      return { after: lastWeekStart(), before: todayEnd() };
    case "yesterday":
      return { after: yesterdayStart(), before: yesterdayEnd() };
    case "lastWeek":
      return { after: lastWeekStart(), before: lastWeekEnd() };
    case "today":
    default:
      return { after: todayStart(), before: todayEnd() };
  }
};

const toYYYYMMDD = (iso: string): string => iso.split("T")[0];

const createSearchContext = (topic: number | string, dateFilter: string, page: number): string =>
  `cat_${topic}_${dateFilter}_p${page}`;

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
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { topic, dateFilter, page = 1 } = await req.json();

    if (topic === null || topic === undefined || !dateFilter) {
      return new Response(
        JSON.stringify({ error: "Missing topic or dateFilter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const source = typeof topic === "number" ? "techcrunch" : "guardian";
    const searchContext = createSearchContext(topic, dateFilter, page);
    const dateRange = getDateRange(dateFilter);

    // 1. Check cache
    const { data: cached, error: cacheError } = await supabase
      .from("news_cache")
      .select("raw_data, source, created_at")
      .eq("search_context", searchContext)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cacheError) throw cacheError;

    if (cached) {
      const age = Date.now() - new Date(cached.created_at).getTime();
      if (age < STALE_MS) {
        console.log("📦 News from cache (raw):", searchContext);
        return new Response(
          JSON.stringify({ source: cached.source, data: cached.raw_data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 2. Fetch raw articles from external API
    let rawArticles: unknown[] = [];

    if (source === "techcrunch") {
      const url = `https://techcrunch1.p.rapidapi.com/v2/posts?categories=${topic}&orderby=date&order=desc&status=publish&page=${page}&per_page=10&after=${dateRange.after}&before=${dateRange.before}`;
      const res = await fetch(url, {
        headers: {
          "x-rapidapi-key": TECHCRUNCH_API_KEY,
          "x-rapidapi-host": "techcrunch1.p.rapidapi.com",
        },
      });
      if (!res.ok) throw new Error(`TechCrunch API error: ${res.status}`);
      const json = await res.json();
      rawArticles = json.data ?? [];
    } else {
      const from = toYYYYMMDD(dateRange.after);
      const to = toYYYYMMDD(dateRange.before);
      const url = `https://content.guardianapis.com/search?section=technology&page-size=10&page=${page}&order-by=newest&show-fields=all&q=smartphone%2C%20iphone%2C%20samsung%2C%20xiaomi%2C%20huawei&from-date=${from}&to-date=${to}&api-key=${GUARDIAN_API_KEY}`;
      const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error(`Guardian API error: ${res.status}`);
      const json = await res.json();
      rawArticles = json.response?.results ?? [];
    }

    // 3. Cache raw articles (replace previous entry for same context)
    if (rawArticles.length > 0) {
      await supabase.from("news_cache").delete().eq("search_context", searchContext);

      const { error: insertError } = await supabase.from("news_cache").insert({
        search_context: searchContext,
        source,
        raw_data: rawArticles,
      });

      if (insertError) throw insertError;
      console.log("✅ News cached (raw):", searchContext);
    }

    return new Response(
      JSON.stringify({ source, data: rawArticles }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error in get-news:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
