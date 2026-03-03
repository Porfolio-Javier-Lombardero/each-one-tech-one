import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const STALE_TIMES = {
  REVIEWS: 24 * 60 * 60 * 1000,
} as const;

// Tipos
interface Review {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  channel_title: string;
  published_at: string;
  video_kind: string;
}

interface SearchResultItem {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

// Validar frescura del caché
const isCacheFresh = (updatedAt: string, staleTime: number): boolean => {
  const now = new Date().getTime();
  const cacheTime = new Date(updatedAt).getTime();
  return now - cacheTime < staleTime;
};

// Mapear resultado de YouTube a Review
const mapReviews = (items: SearchResultItem[]): Review[] => {
  return items.map((item: SearchResultItem): Review => ({
    video_id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description || "",
    thumbnail_url: item.snippet.thumbnails.high.url || "",
    channel_title: item.snippet.channelTitle || "",
    published_at: item.snippet.publishedAt,
    video_kind: item.id.kind || "youtube#video",
  }));
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
      .from("reviews_cache")
      .select("*")
      .order("updated_at", { ascending: false });

    if (cacheError) throw cacheError;

    if (cachedRows && cachedRows.length > 0) {
      const mostRecent = cachedRows[0];

      if (isCacheFresh(mostRecent.updated_at, STALE_TIMES.REVIEWS)) {
        console.log("📦 Reviews from cache");

        const projectedReviews = cachedRows.map(
          ({
            video_id,
            title,
            description,
            thumbnail_url,
            channel_title,
            published_at,
            video_kind,
          }: any) => ({
            video_id,
            title,
            description,
            thumbnail_url,
            channel_title,
            published_at,
            video_kind,
          })
        );

        return new Response(JSON.stringify(projectedReviews), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 2. Fetch from YouTube API
    console.log("🌐 Fetching reviews from YouTube API");

    const query = encodeURIComponent(
      'tech gadget +"review" unboxing 2026 -shorts'
    );
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&order=relevance&relevanceLanguage=en&regionCode=US&maxResults=6&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("No reviews obtained from YouTube");
    }

    const mappedReviews = mapReviews(data.items);

    // 3. Save to cache
    if (mappedReviews && mappedReviews.length > 0) {
      const reviewsToCache = mappedReviews.map((review) => ({
        ...review,
        source: "youtube",
        fetch_count: 1,
      }));

      await supabase.from("reviews_cache").delete().neq("id", 0);

      const { error: insertError } = await supabase
        .from("reviews_cache")
        .insert(reviewsToCache);

      if (insertError) throw insertError;

      console.log("✅ Reviews saved to cache");
    }

    return new Response(JSON.stringify(mappedReviews), {
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