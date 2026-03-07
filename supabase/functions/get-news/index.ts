import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const TECHCRUNCH_API_KEY = Deno.env.get("TECHCRUNCH_API_KEY");
const GUARDIAN_API_KEY = Deno.env.get("GUARDIAN_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const STALE_TIMES = {
  NEWS: 5 * 60 * 60 * 1000,
} as const;

// Tipos
interface DateFilterType {
  type: "all" | "today" | "yesterday" | "lastWeek";
}

interface SingleNew {
  id_hash: string;
  titulo: string;
  description: string;
  cont: string;
  categories: number[];
  fechaIso: string;
  fecha: string;
  url: string;
  img?: string | null;
}

interface TechCrunchArticle {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  link: string;
  yoast_head_json: {
    og_image?: Array<{ url: string }>;
  };
}

interface GuardianArticle {
  webTitle: string;
  fields: {
    trailText: string;
    bodyText: string;
    thumbnail: string;
  };
  webPublicationDate: string;
  webUrl: string;
}

// Funciones de fecha
const todayEnd = (): string => new Date().toISOString();

const todayStart = (): string => {
  const date = new Date();
  const hours = date.getUTCHours();
  date.setUTCHours(hours - 26);
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

interface DateRange {
  after: string;
  before: string;
}

const getDateRangeByFilter = (filter: string): DateRange => {
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

// Funciones de formateo
const formatDate = (param: string | Date): string => {
  const date = new Date(param);
  const month = date.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
};

const formatDateForGuardian = (isoDate: string): string => {
  return isoDate.split("T")[0];
};

// Funciones de mapeo
const generateShortId = (link: string): string => {
  return link.substring(0, 16);
};

const mapNews = (newsArray: TechCrunchArticle[]): SingleNew[] => {
  if (!newsArray) return [];

  return newsArray.map((item: TechCrunchArticle): SingleNew => ({
    id_hash: String(item.id),
    titulo: item.title.rendered,
    description: item.excerpt.rendered,
    cont: item.content.rendered,
    categories: item.categories,
    fechaIso: item.date,
    fecha: formatDate(item.date),
    url: item.link,
    img: item.yoast_head_json.og_image?.splice(-1)[0]?.url || null,
  }));
};

const mapNewsDos = (newsArray: GuardianArticle[]): SingleNew[] => {
  return newsArray.map((item: GuardianArticle): SingleNew => ({
    id_hash: (item.webUrl.split("/").pop() ?? "").substring(0, 16),
    titulo: item.webTitle,
    description: item.fields.trailText,
    cont: item.fields.bodyText,
    categories: [],
    fechaIso: item.webPublicationDate,
    fecha: formatDate(item.webPublicationDate),
    url: item.webUrl,
    img: item.fields.thumbnail,
  }));
};

// Validar frescura del caché
const isCacheFresh = (updatedAt: string, staleTime: number): boolean => {
  const now = new Date().getTime();
  const cacheTime = new Date(updatedAt).getTime();
  return now - cacheTime < staleTime;
};

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

// Crear contexto de búsqueda
const createSearchContext = (topic: number | string, dateFilter: string): string => {
  let topicStr: string;

  if (typeof topic === "number") {
    topicStr = `cat_${topic}`;
  } else {
    const topicMap: Record<string, string> = {
      "smartphone iPhone Android mobile Samsung Pixel foldable": "smartphones",
    };

    topicStr = topicMap[topic] || topic.toLowerCase().replace(/\s+/g, "_").substring(0, 20);
  }

  return `${topicStr}_${dateFilter}`;
};

serve(async (req) => {
  // Manejar preflight requests
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

    const { topic, dateFilter } = await req.json();

    if (topic === null || topic === undefined || !dateFilter) {
      return new Response(
        JSON.stringify({ error: "Missing topic or dateFilter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchContext = createSearchContext(topic, dateFilter);
    const dateRange = getDateRangeByFilter(dateFilter);

    // 1. Verificar caché
    const { data: cachedRows, error: cacheError } = await supabase
      .from("news_cache")
      .select("*")
      .eq("search_context", searchContext)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (cacheError) throw cacheError;

    if (cachedRows && cachedRows.length > 0) {
      const mostRecent = cachedRows[0];

      if (isCacheFresh(mostRecent.updated_at, STALE_TIMES.NEWS)) {
        console.log("📦 News from cache");

        const projectedNews = cachedRows.map(
          ({
            id_hash,
            titulo,
            description,
            cont,
            categories,
            fechaIso,
            fecha,
            url,
            img,
          }: any) => ({
            id_hash,
            titulo,
            description,
            cont,
            categories,
            fechaIso,
            fecha,
            url,
            img,
          })
        );

        return new Response(JSON.stringify(projectedNews), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 2. Fetch from APIs
    let mappedNews: SingleNew[] = [];

    if (typeof topic === "number") {
      // TechCrunch
      const techCrunchOptions = {
        method: "GET",
        headers: {
          "x-rapidapi-key": TECHCRUNCH_API_KEY,
          "x-rapidapi-host": "techcrunch1.p.rapidapi.com",
        },
      };

      const techCrunchUrl = `https://techcrunch1.p.rapidapi.com/v2/posts?categories=${topic}&orderby=date&order=desc&status=publish&page=1&per_page=10&after=${dateRange.after}&before=${dateRange.before}`;

      const techCrunchResponse = await fetch(techCrunchUrl, techCrunchOptions);

      if (!techCrunchResponse.ok) {
        throw new Error(`TechCrunch API error: ${techCrunchResponse.status}`);
      }

      const techCrunchData = await techCrunchResponse.json();
      mappedNews = mapNews(techCrunchData.data || []);
    } else {
      // The Guardian
      const guardianOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const fromDate = formatDateForGuardian(dateRange.after);
      const toDate = formatDateForGuardian(dateRange.before);

      const guardianUrl = `https://content.guardianapis.com/search?section=technology&page-size=10&page=1&order-by=newest&show-fields=all&q=smartphone%2C%20iphone%2C%20samsung%2C%20xiaomi%2C%20huawei&from-date=${fromDate}&to-date=${toDate}&api-key=${GUARDIAN_API_KEY}`;

      const guardianResponse = await fetch(guardianUrl, guardianOptions);

      if (!guardianResponse.ok) {
        throw new Error(`Guardian API error: ${guardianResponse.status}`);
      }

      const guardianData = await guardianResponse.json();
      mappedNews = mapNewsDos(guardianData.response.results || []);
    }

    // 3. Save to cache
    if (mappedNews && mappedNews.length > 0) {
      const newsToCache = mappedNews.map((item) => ({
        ...item,
        search_context: searchContext,
        source: typeof topic === "number" ? "techcrunch" : "guardian",
        fetch_count: 1,
      }));

      await supabase.from("news_cache").delete().eq("search_context", searchContext);

      const { error: insertError } = await supabase.from("news_cache").insert(newsToCache);

      if (insertError) throw insertError;

      console.log("✅ News saved to cache");
    }

    return new Response(JSON.stringify(mappedNews), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in get-news:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});