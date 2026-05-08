import { useQueryClient } from "@tanstack/react-query";
import { Categories } from "@/services/news/interfaces/topics";
import { getTopicId } from "@/services/news/helpers/setCategoryFilter";
import { SingleNew } from "@/services/news/interfaces/d.news.types";

interface InfiniteCache {
  pages?: SingleNew[][];
}

export const useSearchAllCategories = () => {
  const queryClient = useQueryClient();

  // Mismas queryKeys que useGetHeadlines: aprovechamos lo que ya esté cacheado
  // (incluyendo todas las páginas que el infinite query haya traído).
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

  const news: SingleNew[] = sources.flatMap(({ topicId, dateFilter }) => {
    const cached = queryClient.getQueryData<InfiniteCache>([
      "top-headlines",
      topicId,
      dateFilter,
    ]);
    const items = cached?.pages?.flat() ?? [];
    console.log(
      `[keyword-search] cache [top-headlines, ${topicId}, ${dateFilter}]:`,
      items.length,
      "items"
    );
    return items;
  });

  // Volcado completo del cache de tanstack para diagnosticar
  const allQueries = queryClient.getQueryCache().getAll();
  console.log(
    "[keyword-search] ALL cached queryKeys:",
    allQueries.map((q) => q.queryKey)
  );

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
