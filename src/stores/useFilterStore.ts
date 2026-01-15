import React from "react";
import { create } from "zustand";
import { today, yesterday } from "../services/utils/formatDate";

export const useFilterStore = create((set) => ({
  filtredNews: null,

  yesterdayNews: (news) => {
    const hoy = today();
    const ayer = yesterday(hoy);

    const yesterdayNews = news.filter((noticia) => {
      const fechaNoticia = new Date(noticia.fechaIso); // Asegúrate de convertir a Date
      return fechaNoticia >= ayer && fechaNoticia < hoy;
    });

    set({ filtredNews: yesterdayNews });
  },
  lastWeekNews: (news) => {
    const hoy = today();
    const ayer = yesterday(hoy);

    const lastWeekNews = news.filter((noticia) => {
      const fechaNoticia = new Date(noticia.fechaIso); // Asegúrate de convertir a Date
      return fechaNoticia < ayer;
    });

    set({ filtredNews: lastWeekNews });
  },
  resetFilter: () => {
    set({
      filtredNews: null,
    });
  },
}));
