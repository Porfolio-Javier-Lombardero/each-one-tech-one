import { useQueryClient } from "@tanstack/react-query";
import {  Categories } from "@/domain/Topic";
import { getTopicId } from "@/features/news/services/helpers/setCategoryFilter";
import { Article } from "@/domain/Article";

interface InfiniteCache {
  pages?: Article[][];
}

export const useSearchAllCategories = () => {
  const queryClient = useQueryClient();

  const sources: Array<{ topicId: number | string; dateFilter: "all" | "today" }> = [
    { topicId: 0, dateFilter: "all" },
    ...Object.values(Categories).map((cat) => ({
      topicId: getTopicId(cat),
      dateFilter: "all" as const,
    })),
    ...Object.values(Categories).map((cat) => ({
      topicId: getTopicId(cat),
      dateFilter: "today" as const,
    })),
  ];

  const news: Article[] = sources.flatMap(({ topicId, dateFilter }) => {
    const cached = queryClient.getQueryData<InfiniteCache>([
      "top-headlines",
      topicId,
      dateFilter,
    ]);
    return cached?.pages?.flat() ?? [];
  });

  const seen = new Set<string>();
  const uniqueNews = news.filter((n) => {
    if (!n?.id_hash) return false;
    if (seen.has(n.id_hash)) return false;
    seen.add(n.id_hash);
    return true;
  });

  return {
    isLoading: false,
    news: uniqueNews,
  };
};
