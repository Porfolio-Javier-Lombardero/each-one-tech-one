// import { Topics2 } from "@/services/news/interfaces/topics";
import { getDateRangeByFilter } from "./helpers/defineDates";
import { formatDateForGuardian } from "./helpers/formatDates";
import { mapNews } from "./helpers/mapNews";
import { mapNewsDos } from "./helpers/mapNewsDos";
import {
  News,
  DateFilterType
} from "./interfaces/d.news.types";
import { Topics2 } from "./interfaces/topics";



const CRUNCH_API_KEY = import.meta.env.VITE_TECHCRUNCH_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_THEGUARDIAN_API_KEY;

//Helper: Obtener query segura de Topics2
// const getSearchQuery = (topic: number): string | null => {
//   return Topics2[topic as keyof typeof Topics2] || null;
// };

export const newsFetch = async (
  topic: number | string,
  dateFilter: DateFilterType
): Promise<News | void> => {
  try {
    if (typeof topic !== "string") {
      const techCrunchOptions = {
        method: "GET",
        headers: {
          "x-rapidapi-key": CRUNCH_API_KEY,
          "x-rapidapi-host": "techcrunch1.p.rapidapi.com",
        },
      };

      const dateRange = getDateRangeByFilter(dateFilter);

      const techCrunchUrl = `https://techcrunch1.p.rapidapi.com/v2/posts?categories=${topic}&orderby=date&order=desc&status=publish&page=1&per_page=25&after=${dateRange.after}&before=${dateRange.before}`;

      const techCrunchResponse = await fetch(techCrunchUrl, techCrunchOptions);

      if (!techCrunchResponse.ok) {
        throw new Error(`TechCrunch API error: ${techCrunchResponse.statusText}`);
      }

      const techCrunchData = await techCrunchResponse.json();
      const news = techCrunchData.data;

      return mapNews(news);
    } else {
      const guardianOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const dateRange = getDateRangeByFilter(dateFilter);

      const fromDate = formatDateForGuardian(dateRange.after);
      const toDate = formatDateForGuardian(dateRange.before);

      const guardianUrl = `https://content.guardianapis.com/search?section=technology&page-size=20&order-by=newest&show-fields=all&from-date=${fromDate}&to-date=${toDate}&api-key=${GUARDIAN_API_KEY}`;

      const guardianResponse = await fetch(guardianUrl, guardianOptions);

      if (!guardianResponse.ok) {
        throw new Error(`Guardian API error: ${guardianResponse.statusText}`);
      }

      const guardianData = await guardianResponse.json();
      const newsArrayDos = guardianData.response?.results || [];

      if (newsArrayDos.length > 0) {
        const news = mapNewsDos(newsArrayDos);
        return news;
      }
    }
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado por el consumidor de la función
  }
};

