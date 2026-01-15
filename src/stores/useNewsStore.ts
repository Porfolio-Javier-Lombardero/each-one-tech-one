import { create, StateCreator } from "zustand";
import { News, SingleNew } from "../lib/types/d.news.types";
import { newsFetch } from "../services/api/setNewsFetch";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface NewsStoreInt {
  news: News | undefined;
  singleNew: SingleNew | undefined;
  filteredNews: Array<{ category: number; news: News }>;
  loading: boolean;
  error: string | undefined;
  //Actions
  searchHeadLines: (topic: number) => Promise<void>;
  searchByCategory: (topic: number) => Promise<void>;
  defineSingleNew: (noticia: SingleNew) => void;
}

const newsState: StateCreator<NewsStoreInt> = (set, get) => ({
  news: undefined,
  singleNew: undefined,
  filteredNews: [],
  loading: true,
  error: undefined,
  // Actions
  searchHeadLines: async () => {
    set({ loading: true });
    try {
      const lastNews = await newsFetch(0);
      set({
        news: lastNews ? lastNews : undefined,
        loading: false,
        error: undefined,
      });
    } catch (error) {
      set({
        news: undefined,
        loading: false,
        error: error as string,
      });
      throw new Error("Error al cargar noticias");
    }
  },
  searchByCategory: async (topic: number) => {
    set({ loading: true });
    if (get().filteredNews.find((n) => n.category === topic)) return;

    try {
      const categoryNews = await newsFetch(topic);

      if (categoryNews) {
        set((state) => {
            state.filteredNews.push({
            category: topic,
            news: categoryNews,
          });
          state.loading = false;
          state.error = undefined;
        });
      }
    } catch (error) {
      set({
        news: undefined,
        loading: false,
        error: error as string,
      });
      throw new Error("Error al cargar noticias");
    }
  },
  defineSingleNew: (noticia: SingleNew) => {
    set({ singleNew: noticia });
  },
});

export const useNewsStore = create<NewsStoreInt>()(
  devtools(
    persist(immer(newsState), {
      name: "News-Store",
    })
  )
);
