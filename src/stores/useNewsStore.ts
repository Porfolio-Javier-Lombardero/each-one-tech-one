import { create, StateCreator } from "zustand";
import { News, SingleNew, DateFilterType } from "../lib/types/d.news.types";
import { newsFetch } from "../services/api/setNewsFetch";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { fetchEvents } from "@/services/api/setEventsFetch";


interface CategoryCache {
  category: number | string;
  news: News;
  dateFilter: DateFilterType;

}

interface NewsStoreInt {
  news: News | undefined;
  singleNew: SingleNew | undefined;
  filteredNews: CategoryCache[];
  events: string
  loading: boolean;
  error: string | undefined;
  //Actions
  searchHeadLines: (topic: number, dateFilter: DateFilterType) => Promise<void>;
  searchByCategory: (
    topic: number | string,
    dateFilter?: DateFilterType,
  ) => Promise<void>;
  defineSingleNew: (noticia: SingleNew) => void;
  searchTechEvents: () => Promise<void>
}

// Helper para verificar si una categoría ya está en el caché
const isCategoryInCache = (
  filteredNews: CategoryCache[],
  category: number | string,
  dateFilter: DateFilterType,
): boolean => {
  return filteredNews.some(
    (n) => n.category === category && n.dateFilter === dateFilter,
  );
};

const newsState: StateCreator<NewsStoreInt, [["zustand/immer", never]], []> = (
  set,
  get,
) => ({
  news: undefined,
  singleNew: undefined,
  filteredNews: [],
  loading: false,
  error: undefined,
  events: "",
  // Actions
  searchHeadLines: async (topic: number, dateFilter: DateFilterType = 'all') => {
    set((state: NewsStoreInt) => {
      state.loading = true;
    });
    try {

      const lastNews = await newsFetch(topic, dateFilter);

      if (lastNews) {
        set((state: NewsStoreInt) => {
          state.news = lastNews ? lastNews : undefined;
          state.loading = false;
          state.error = undefined;
        });
      }
    } catch (error) {
      set((state: NewsStoreInt) => {
        state.news = undefined;
        state.loading = false;
        state.error = error as string;
      });
      throw new Error("Error al cargar noticias");
    }
  },
  searchByCategory: async (
    topic: number | string,
    dateFilter: DateFilterType = "today",
  ) => {
    set((state: NewsStoreInt) => {
      state.loading = true;
    });

    if (isCategoryInCache(get().filteredNews, topic, dateFilter)) {
      set((state: NewsStoreInt) => {
        state.loading = false;
      });
      return;
    }

    try {
      const categoryNews = await newsFetch(topic, dateFilter);

      if (categoryNews) {
        set((state: NewsStoreInt) => {
          state.filteredNews.push({
            category: topic,
            dateFilter: dateFilter,
            news: categoryNews,
          });
          state.loading = false;
          state.error = undefined;
        });
      }
    } catch (error) {
      set((state: NewsStoreInt) => {
        state.news = undefined;
        state.loading = false;
        state.error = error as string;
      });
      throw new Error("Error al cargar noticias");
    }
  },
  defineSingleNew: (noticia: SingleNew) => {
    set((state: NewsStoreInt) => {
      state.singleNew = noticia;
    });
  },
  searchTechEvents: async () => {
    // Si ya tenemos eventos en caché, no volver a llamar la API
    if (get().events) {
      console.log('📦 Using cached events');
      return;
    }

    set((state: NewsStoreInt) => {
      state.loading = true;
    });
    try {
      const data = await fetchEvents();
      console.log('✅ Events fetched:', data)
      set((state: NewsStoreInt) => {
        state.loading = false;
        state.events = data
      });
    } catch (err) {
      set((state: NewsStoreInt) => {
        state.events = "";
        state.loading = false;
        state.error = err as string;
      })
    } finally {
      set((state: NewsStoreInt) => {
        state.loading = false
      });
    }
  }
});

export const useNewsStore = create<NewsStoreInt>()(
  devtools(
    persist(immer(newsState), {
      name: "News-Store",
    }),
  ),
);
