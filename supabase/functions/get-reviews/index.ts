import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const STALE_MS = 24 * 60 * 60 * 1000;

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
      .from("reviews_cache")
      .select("raw_data, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cacheError) throw cacheError;

    if (cached) {
      const age = Date.now() - new Date(cached.created_at).getTime();
      if (age < STALE_MS) {
        console.log("📦 Reviews from cache (raw)");
        return new Response(JSON.stringify(cached.raw_data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 2. Fetch raw items from YouTube API
    console.log("🌐 Fetching reviews from YouTube API");
    const query = encodeURIComponent('tech gadget +"review" unboxing 2026 -shorts');
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&order=relevance&relevanceLanguage=en&regionCode=US&maxResults=6&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(youtubeUrl);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("No reviews obtained from YouTube");
    }

    const rawItems = data.items;

    // 3. Cache raw items (replace previous row)
    await supabase.from("reviews_cache").delete().gt("id", 0);

    const { error: insertError } = await supabase
      .from("reviews_cache")
      .insert({ raw_data: rawItems });

    if (insertError) throw insertError;

    console.log("✅ Reviews cached (raw)");

    return new Response(JSON.stringify(rawItems), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in get-reviews:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
