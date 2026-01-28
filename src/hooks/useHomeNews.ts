import { useEffect } from "react";
import { useNewsStore } from "@/stores/useNewsStore";
import { mapEvents } from "@/services/utils/mapEvents";

export const useHomeNews = () => {
    const searchHeadLines = useNewsStore((state) => state.searchHeadLines);
    const searchEvents = useNewsStore((state) => state.searchTechEvents)
    const searchReviwes = useNewsStore((state)=> state.searchTechReviews)
    const news = useNewsStore((state) => state.news);
    const loading = useNewsStore((state) => state.loading);
    const events = useNewsStore((state)=> state.events)
    const reviews = useNewsStore((state)=> state.reviews)

    useEffect(() => {
        if (!news) {
            searchHeadLines(0, "all");
        }
        searchEvents()
         searchReviwes()
    }, []);

    return { news, loading,events,reviews };
};
