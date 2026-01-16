import { create, StateCreator } from "zustand";
import { News, SingleNew, DateFilterType } from "../lib/types/d.news.types";
import { newsFetch } from "../services/api/setNewsFetch";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CategoryCache {
  category: number;
  news: News;
  dateFilter: DateFilterType;
}

interface NewsStoreInt {
  news: News | undefined;
  singleNew: SingleNew | undefined;
  filteredNews: CategoryCache[];
  loading: boolean;
  error: string | undefined;
  //Actions
  searchHeadLines: (topic: number) => Promise<void>;
  searchByCategory: (topic: number, dateFilter?: DateFilterType) => Promise<void>;
  defineSingleNew: (noticia: SingleNew) => void;
}

// Helper para verificar si una categoría ya está en el caché
const isCategoryInCache = (
  filteredNews: CategoryCache[],
  category: number,
  dateFilter: DateFilterType
): boolean => {
  return filteredNews.some(
    (n) => n.category === category && n.dateFilter === dateFilter
  );
};

const newsState: StateCreator<NewsStoreInt, [["zustand/immer", never]], []> = (set, get) => ({
  news: undefined,
  singleNew: undefined,
  filteredNews: [],
  loading: false,
  error: undefined,
  // Actions
  searchHeadLines: async () => {
    set((state: NewsStoreInt) => {
      state.loading = true;
    });

    try {
      const lastNews = await newsFetch(0);
      set((state: NewsStoreInt) => {
        state.news = lastNews ? lastNews : undefined;
        state.loading = false;
        state.error = undefined;
      });
    } catch (error) {
      set((state: NewsStoreInt) => {
        state.news = undefined;
        state.loading = false;
        state.error = error as string;
      });
      throw new Error("Error al cargar noticias");
    }
  },
  searchByCategory: async (topic: number, dateFilter: DateFilterType = 'today') => {
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
            news: categoryNews,
            dateFilter: dateFilter
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
});

export const useNewsStore = create<NewsStoreInt>()(
  devtools(
    persist(
      immer(newsState),
      {
        name: "News-Store",
      }
    )
  )
);
