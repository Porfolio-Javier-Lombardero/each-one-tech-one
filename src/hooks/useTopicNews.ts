import { useEffect } from "react";
import { useNewsStore } from "@/stores/useNewsStore";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";

export const useTopicNews = (topic: string | undefined) => {
    const { setCategory, getTopicId } = useCategoryFilter();
    const loading = useNewsStore((state) => state.loading);
    const filteredNews = useNewsStore((state) => state.filteredNews);

    const topicId = getTopicId(topic);
    const topicNews = filteredNews.find((n) => n.category === topicId)?.news;

    useEffect(() => {
        if (topic) {
            setCategory(topic);
        }
    }, [topic]);

    return { topicNews, loading };
};
