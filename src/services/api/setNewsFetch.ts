import { Topics2 } from "@/lib/constants/topics";
import { News, DateFilterType, SingleNew, TechCrunchArticle } from "../../lib/types/d.news.types";
import { getDateRangeByFilter } from "../utils/defineDates";
import { formatDateForGuardian } from "../../utils/formatDates";
import { mapNews } from "../utils/mapNews";
import { mapNewsDos } from "../utils/mapNewsDos";
import { getNewsFromCache, saveMultipleNewsToCache } from "./newsCacheService";

const CRUNCH_API_KEY = import.meta.env.VITE_TECHCRUNCH_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_THEGUARDIAN_API_KEY;

// Helper: Obtener query segura de Topics2
const getSearchQuery = (topic: number): string | null => {
  return Topics2[topic as keyof typeof Topics2] || null;
};

export const newsFetch = async (topic: number | string, dateFilter: DateFilterType = "today",): Promise<News | void> => {
  // Determinar el search_context basado en el topic
  const searchContext = typeof topic === 'string'
    ? `keyword_${topic.toLowerCase().replace(/\s+/g, '_')}`
    : topic === 0
      ? 'homepage'
      : `category_${topic}`;

  // ==================== PASO 0: Intentar obtener del CACHÉ (7 horas) ====================
  // Estrategia: Buscar artículos recientes de las últimas 7 horas de esta categoría
  // Luego filtrar localmente según el dateFilter que el usuario pidió
  if (typeof topic !== "string") {
    console.log(`🔍 Buscando en caché reciente: context=${searchContext}`);

    const cachedNews = await getNewsFromCache(
      'techcrunch',
      searchContext,
      7 // 7 horas de caché
    );

    if (cachedNews && cachedNews.length > 0) {
      // Filtrar localmente por el rango de fechas específico del usuario
      const dateRange = getDateRangeByFilter(dateFilter, topic);
      const filteredNews = cachedNews.filter(article => {
        const articleDate = new Date(article.fechaIso);
        const afterDate = new Date(dateRange.after);
        const beforeDate = new Date(dateRange.before);
        return articleDate >= afterDate && articleDate <= beforeDate;
      });

      if (filteredNews.length > 0) {
        console.log(`✅ ¡Caché encontrado! ${cachedNews.length} artículos (7 horas), ${filteredNews.length} después de filtrar por '${dateFilter}' (ahorraste $$$)`);
        return filteredNews;
      }

      console.log(`⚠️ Caché existe pero no hay artículos en el rango '${dateFilter}', consultando APIs...`);
    } else {
      console.log(`📭 No hay caché válido, consultando APIs...`);
    }
  }

  // ==================== INTENTO 1: TechCrunch (con estrategia de caché amplio) ====================
  // Si topic es string, saltar TechCrunch e ir directo a Guardian (mejores resultados)

  if (typeof topic !== "string") {
    try {
      const techCrunchOptions = {
        method: "GET",
        headers: {
          "x-rapidapi-key": CRUNCH_API_KEY,
          "x-rapidapi-host": "techcrunch1.p.rapidapi.com",
        },
      };

      // 🔥 ESTRATEGIA: Buscar SIEMPRE 7 días completos en la API
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const wideAfter = sevenDaysAgo.toISOString();
      const wideBefore = new Date().toISOString();

      // Construir URL con rango de 7 días completos
      const techCrunchUrl = typeof topic === "string" ?
        `https://techcrunch1.p.rapidapi.com/v2/posts?search=${encodeURIComponent(topic)}&orderby=relevance&order=desc&status=publish&page=1&per_page=25&after=${wideAfter}&before=${wideBefore}`
        :
        `https://techcrunch1.p.rapidapi.com/v2/posts?categories=${topic}&orderby=date&order=desc&status=publish&page=1&per_page=25&after=${wideAfter}&before=${wideBefore}`;


      console.log(`📡 Solicitando a TechCrunch API: 7 días completos del topic ${topic}`);
      const techCrunchResponse = await fetch(techCrunchUrl, techCrunchOptions);

      if (!techCrunchResponse.ok) {
        throw new Error(`TechCrunch API error: ${techCrunchResponse.status}`);
      }

      const techCrunchData = await techCrunchResponse.json();
      const newsArray = techCrunchData.data;

      // Si TechCrunch devuelve resultados, guardar en caché y retornar
      if (newsArray && newsArray.length > 0) {
        const news = mapNews(newsArray);

        // Validar que mapNews devolvió datos
        if (!news || news.length === 0) {
          console.log('⚠️ mapNews no devolvió datos válidos');
          throw new Error('No se pudieron mapear los artículos de TechCrunch');
        }

        // 💾 Guardar TODOS los artículos de 7 días en caché
        console.log(`💾 Guardando ${newsArray.length} artículos (7 días) en caché con context='${searchContext}'...`);

        const articlesWithIds = newsArray.map((item: TechCrunchArticle, index: number) => ({
          id: item.id, // ID original de TechCrunch
          article: news[index]
        }));

        await saveMultipleNewsToCache('techcrunch', articlesWithIds, searchContext);

        // 🔍 Filtrar localmente por el dateFilter específico del usuario
        const dateRange = getDateRangeByFilter(dateFilter, topic);
        const filteredNews: News = news.filter((article: SingleNew) => {
          const articleDate = new Date(article.fechaIso);
          const afterDate = new Date(dateRange.after);
          const beforeDate = new Date(dateRange.before);
          return articleDate >= afterDate && articleDate <= beforeDate;
        });

        console.log(`📊 Retornando ${filteredNews.length} artículos filtrados para '${dateFilter}' (de ${news.length} guardados en caché)`);
        return filteredNews;
      }

    } catch (error) {
      console.error("❌ TechCrunch API failed:", error);
      // No re-throw: permitir fallback al Guardian
    }
  }

  // ==================== INTENTO 2: Guardian API ====================
  // Para búsquedas por string, Guardian es la mejor opción
  // Si topic es string, usarlo directamente; si es number, buscar en Topics2

  const searchQuery = typeof topic === "string" ? topic : getSearchQuery(topic);

  // Si no hay query definida, no tiene sentido hacer el fetch
  if (!searchQuery) {
    console.warn(`⚠️ No fallback query defined for topic ${topic} in Topics2`);
    return [];
  }

  try {
    const guardianOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Obtener rango de fechas para Guardian
    const dateRange = getDateRangeByFilter(dateFilter, topic);

    // Formatear fechas para Guardian (YYYY-MM-DD)
    const fromDate = formatDateForGuardian(dateRange.after);
    const toDate = formatDateForGuardian(dateRange.before);

    const guardianUrl = `https://content.guardianapis.com/search?section=technology&page-size=20&order-by=newest&show-fields=all&q=${encodeURIComponent(searchQuery)}&from-date=${fromDate}&to-date=${toDate}&api-key=${GUARDIAN_API_KEY}`;

    const guardianResponse = await fetch(guardianUrl, guardianOptions);

    if (!guardianResponse.ok) {
      throw new Error(`Guardian API error: ${guardianResponse.status}`);
    }

    const guardianData = await guardianResponse.json();
    const newsArrayDos = guardianData.response?.results || [];

    if (newsArrayDos.length > 0) {
      const news = mapNewsDos(newsArrayDos);

      // 💾 Guardar artículos de The Guardian en caché con search_context
      console.log(`💾 Guardando ${newsArrayDos.length} artículos de The Guardian en caché con context='${searchContext}'...`);

      // The Guardian usa un ID diferente, extraerlo del objeto
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const articlesWithIds = newsArrayDos.map((item: any, index: number) => ({
        id: parseInt(item.id.split('/').pop() || Date.now().toString()), // Extraer número del ID
        article: news[index]
      }));

      await saveMultipleNewsToCache('theguardian', articlesWithIds, searchContext);

      return news;
    }
  } catch (error) {
    console.error("❌ Guardian API failed:", error);
    throw error;
  }

  console.error(`❌ No articles found from any source for topic ${topic}`);
  return [];
};
