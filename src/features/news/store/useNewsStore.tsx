import { create, StateCreator } from "zustand";
import { News, SingleNew } from "../types/d.news.types";
import { newsFetch } from "../api/setNewsFetch";
import { devtools, persist } from "zustand/middleware";

interface NewsStoreInt {
  news: News | undefined;
  singleNew: SingleNew | undefined;
  loading: boolean;
  error: string | undefined;
  //Actions
  searchHeadLines: (topic: string) => Promise<void>;
  defineSingleNew: (noticia:SingleNew) => void;
}

const newsState: StateCreator<NewsStoreInt> = (set) => ({
  news: undefined,
  singleNew:undefined,
  loading: true,
  error: undefined,
  // Actions
  searchHeadLines: async (topic: string) => {
    try {
      const lastNews = await newsFetch(topic);
      set({
        news: lastNews,
        loading: false,
        error: undefined,
      });
    } catch (error) {
      set({
        news: undefined,
        loading: false,
        error: error as string,
      });
      throw new Error("error");
    }
  },
  defineSingleNew:(noticia: SingleNew)=>{
    set({
        singleNew:noticia
    })
  },
});

export const useNewsStore = create<NewsStoreInt>()(
 devtools( 
    persist(
        newsState, {
         name: "News-Store",
        }
     ))
);
