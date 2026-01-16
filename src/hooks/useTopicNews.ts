import { useEffect } from "react";
import { DateFilterType } from "@/lib/types/d.news.types";
import { useNewsStore } from "@/stores/useNewsStore";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";

export const useTopicNews = (
    topic: string | undefined,
    dateFilter: DateFilterType = 'today'
) => {
    const { setCategory, getTopicId } = useCategoryFilter();
    const loading = useNewsStore((state) => state.loading);
    const filteredNews = useNewsStore((state) => state.filteredNews);

    const topicId = getTopicId(topic);
    const topicNews = filteredNews.find(
        (n) => n.category === topicId && n.dateFilter === dateFilter
    )?.news;

    useEffect(() => {
        if (topic) {
            setCategory(topic, dateFilter);
        }
    }, [topic, dateFilter]);

    return { topicNews, loading };
};
