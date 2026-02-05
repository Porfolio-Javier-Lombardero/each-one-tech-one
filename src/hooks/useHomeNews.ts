import { useEffect } from "react";
import { useStore } from "@/store";

export const useHomeNews = () => {
    const searchHeadLines = useStore((state) => state.searchTopHeadLines);
    const searchEvents = useStore((state) => state.searchTechEvents)
    const searchReviwes = useStore((state) => state.searchTechReviews)
    const news = useStore((state) => state.news);
    const loading = useStore((state) => state.loadingNews);
    const events = useStore((state) => state.events)
    const reviews = useStore((state) => state.reviews)

    useEffect(() => {
        if (!news) {
            searchHeadLines(0, undefined);
        }
        searchEvents()
        searchReviwes()
    }, []);

    return { news, loading, events, reviews };
};


