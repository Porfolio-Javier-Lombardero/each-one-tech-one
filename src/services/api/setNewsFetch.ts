import { Topics2 } from "@/lib/constants/topics";
import { News, DateFilterType } from "../../lib/types/d.news.types";
import { getDateRangeByFilter } from "../utils/defineDates";
import { formatDateForGuardian } from "../../utils/formatDates";
import { mapNews } from "../utils/mapNews";
import { mapNewsDos } from "../utils/mapNewsDos";

const CRUNCH_API_KEY = import.meta.env.VITE_TECHCRUNCH_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_THEGUARDIAN_API_KEY;

// Helper: Obtener query segura de Topics2
const getSearchQuery = (topic: number): string | null => {
  return Topics2[topic as keyof typeof Topics2] || null;
};

export const newsFetch = async (topic: number | string,dateFilter: DateFilterType = "today",): Promise<News | void> =>
  {
  const dateRange = getDateRangeByFilter(dateFilter, topic);

  // ==================== INTENTO 1: TechCrunch ====================
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

      // Construir URL según el tipo de topic
      const techCrunchUrl = typeof topic === "string" ?
        `https://techcrunch1.p.rapidapi.com/v2/posts?search=${encodeURIComponent(topic)}&orderby=relevance&order=desc&status=publish&page=1&per_page=25&after=${dateRange.after}&before=${dateRange.before}`
        :
        `https://techcrunch1.p.rapidapi.com/v2/posts?categories=${topic}&orderby=date&order=desc&status=publish&page=1&per_page=25&after=${dateRange.after}&before=${dateRange.before}`;



      const techCrunchResponse = await fetch(techCrunchUrl, techCrunchOptions);

      if (!techCrunchResponse.ok) {
        throw new Error(`TechCrunch API error: ${techCrunchResponse.status}`);
      }

      const techCrunchData = await techCrunchResponse.json();
      const newsArray = techCrunchData.data;

      // Si TechCrunch devuelve resultados, retornar
      if (newsArray && newsArray.length > 0) {
        const news = mapNews(newsArray);
        return news;
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
      return news ;
    }
  } catch (error) {
    console.error("❌ Guardian API failed:", error);
    throw error;
  }

  console.error(`❌ No articles found from any source for topic ${topic}`);
  return [];
};
