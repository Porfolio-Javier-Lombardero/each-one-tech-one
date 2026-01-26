import { useEffect } from "react";
import { useNewsStore } from "@/stores/useNewsStore";

export const useHomeNews = () => {
    const searchHeadLines = useNewsStore((state) => state.searchHeadLines);
    const searchEvents = useNewsStore((state)=> state.searchTechEvents)
    const news = useNewsStore((state) => state.news);
    const loading = useNewsStore((state) => state.loading);

    useEffect(() => {
        if (!news) {
            searchHeadLines(0, "all");
        }
        searchEvents()
    }, []);

    return { news, loading };
};
