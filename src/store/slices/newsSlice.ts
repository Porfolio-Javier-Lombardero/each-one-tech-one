
import { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { NewsSlice } from "./types/d.slices.types";
import { DateFilterType, SingleNew } from "@/lib/types/d.news.types";
import { newsFetch as setNewsFetch } from "@/services/api/setNewsFetch";
import { CategoryCache } from "@/lib/types/d.cache.types";


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
    topHeadLines: async (topic: string | number, dateFilter: DateFilterType | undefined = 'all') => {
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
    }
}))