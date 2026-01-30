import { useEffect } from "react";
import { useStore } from "@/store";

export const useHomeNews = () => {
    const searchHeadLines = useStore((state) => state.topHeadLines);
    const searchEvents = useStore((state) => state.searchTechEvents)
    const searchReviwes = useStore((state) => state.searchTechReviews)
    const news = useStore((state) => state.news);
    const loading = useStore((state) => state.loadingNews);
    const events = useStore((state) => state.events)
    const reviews = useStore((state) => state.reviews)

    useEffect(() => {
        if (!news) {
            searchHeadLines(0, "all");
        }
        searchEvents()
        searchReviwes()
    }, []);

    return { news, loading, events, reviews };
};
