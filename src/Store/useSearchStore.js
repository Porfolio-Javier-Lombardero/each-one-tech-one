import { create } from "zustand";
import { newsFetch } from "../Services/setNewsFetch";

import { checkLocalStorage } from "../Services/setLocalStorage";
import { devtools } from "zustand/middleware";

const useSearchStore = (create((set) => ({
  news: null,
  events: null,
  rapshody: null,
  loading: true,
  error: false,

  SearchHeadlines: async (topic) => {
    try {
      const noticias = await newsFetch(topic);

      set({
        news: noticias,
        loading: false,
        error: false,
      });
    } catch {
      set({
        error: true,
        loading: false,
      });
    }
  },
  SearchRapsodhy: async () => {
    const topic = "rapshody";
    const check = checkLocalStorage(topic);

    if (check) {
      set({
        rapshody: check.results,
        loading: false,
        error: false,
      });
    }

    try {
      const noticias = await newsFetch(topic);

      set({
        rapshody: noticias,
        loading: false,
        error: false,
      });
    } catch {
      set({
        error: true,
        loading: false,
      });
    }
  },
  SearchEvents: async () => {
    const topic = "fair OR event";

    const check = checkLocalStorage(topic);

    if (check) {
      set({
        events: check.results,
        loading: false,
        error: false,
      });
      return;
    }
    try {
      const noticias = await newsFetch(topic);

      set({
        events: noticias,
        loading: false,
        error: false,
      });
    } catch {
      set({
        error: true,
        loading: false,
      });
    }
  },
  SingleNew: (noticia) => {
    set(() => ({
      singleNew: noticia,
    }));
  },
})));

export default useSearchStore;
