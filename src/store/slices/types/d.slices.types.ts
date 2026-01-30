import { CategoryCache } from "@/lib/types/d.cache.types";
import { Events } from "@/lib/types/d.events.types";
import { DateFilterType, News, SingleNew } from "@/lib/types/d.news.types";



export interface NewsSlice {
    news: News | undefined;
    singleNew: SingleNew | undefined;
    filteredNews: CategoryCache[];
    loadingNews:boolean;
    error:string | undefined;
    // Actions
    topHeadLines: (topic: string | number, dateFilter?: DateFilterType | undefined) => Promise<void>;
    searchByCategory: (
        topic: number | string,
        dateFilter?: DateFilterType,
      ) => Promise<void>;
    defineSingleNew: (noticia: SingleNew) => void;
}

export interface EventsSlice {
    events: Events[] | undefined;
    loadingEvents: boolean;
    error: string | undefined
    //Actions
    searchTechEvents: () => Promise<void>
}

export interface ReviewsSlice {
    reviews: string[]| undefined;
    loadingReviews: boolean;
    error:string|undefined
    //Actions
    searchTechReviews: () => Promise<void>;
}