import { create } from "zustand";



import { newsFetch } from "../hooks/setNewsFetch";


const useSearchStore = (create((set) => ({
  news: null,
  events: null,
  rapshody: null,
  loading: true,
  error: false,

  SearchHeadlines: async (encodedBar) => {
    console.log("cosas")
    try {
      const noticias = await newsFetch(encodedBar);

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
  


    try {
      const noticias = await newsFetch(encodedBar);

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


    try {
      const noticias = await newsFetch(encodedBar);

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
