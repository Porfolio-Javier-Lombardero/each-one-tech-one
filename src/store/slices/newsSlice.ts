
import { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { NewsSlice } from "./interfaces/d.slices.types";
import { DateFilterType, SingleNew } from "@/services/news/interfaces/d.news.types";
import { newsFetch as setNewsFetch } from "@/services/news/setNewsFetch";
import { CategoryCache } from "@/services/news/interfaces/d.cache.types";


const isCategoryInCache = (
    filteredNews: CategoryCache[],
    category: number | string,
    dateFilter: DateFilterType,
): boolean => {
    return filteredNews.some(
        (n) => n.category === category && n.dateFilter === dateFilter,
    );
};

export const createNewsSlice: StateCreator<NewsSlice, [], [["zustand/immer", never]]> = immer((set, get) => ({
    news: undefined,
    singleNew: undefined,
    filteredNews: [],
    loadingNews: false,
    error: undefined,
    //Actions
    searchTopHeadLines: async (topic: string | number, dateFilter: DateFilterType | undefined = 'all') => {
        set((state: NewsSlice) => {
            state.loadingNews = true;
        });
        try {

            const lastNews = await setNewsFetch(topic, dateFilter);

            if (lastNews) {
                set((state: NewsSlice) => {
                    state.news = lastNews ? lastNews : undefined;
                    state.loadingNews = false;
                    state.error = undefined;
                });
            }
        } catch (error) {
            set((state: NewsSlice) => {
                state.news = undefined;
                state.loadingNews = false;
                state.error = error as string;
            });
            throw new Error("Error al cargar noticias");
        }
    },
    searchByCategory: async (
        topic: number | string,
        dateFilter: DateFilterType = "today",
    ) => {
        set((state: NewsSlice) => {
            state.loadingNews = true;
        });

        if (isCategoryInCache(get().filteredNews, topic, dateFilter)) {
            set((state: NewsSlice) => {
                state.loadingNews = false;
            });
            return;
        }

        try {
            const categoryNews = await setNewsFetch(topic, dateFilter);

            if (categoryNews) {
                set((state: NewsSlice) => {
                    state.filteredNews.push({
                        category: topic,
                        dateFilter: dateFilter,
                        news: categoryNews,
                    });
                    state.loadingNews = false;
                    state.error = undefined;
                });
            }
        } catch (error) {
            set((state: NewsSlice) => {
                state.news = undefined;
                state.loadingNews = false;
                state.error = error as string;
            });
            throw new Error("Error al cargar noticias");
        }
    },
    defineSingleNew: (noticia: SingleNew) => {
        set((state: NewsSlice) => {
            state.singleNew = noticia;
        });
    },
    searchByKeywords: (keywords: string[]) => {
        const currentNews = get().news;

        if (!currentNews || currentNews.length === 0) {
            return;
        }

        // Buscar noticias cuyo título contenga alguna de las palabras clave
        const foundNews = currentNews.filter((article) => {
            const titleLower = article.titulo.toLowerCase();
            return keywords.some((keyword) =>
                titleLower.includes(keyword.toLowerCase())
            );
        });

        // Remover búsqueda anterior si existe
        const filteredWithoutSearch = get().filteredNews.filter(
            (item) => item.category !== 'foundAtWeb'
        );

        // Agregar nueva búsqueda
        set((state: NewsSlice) => {
            state.filteredNews = [
                ...filteredWithoutSearch,
                {
                    category: 'foundAtWeb',
                    dateFilter: 'today',
                    news: foundNews,
                }
            ];
        });
    }
}))