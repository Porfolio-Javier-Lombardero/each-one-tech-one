import { Article } from "@/domain/Article";
import { ArticleRepository } from "@/domain/ports/ArticleRepository";
import { supabaseArticleRepository } from "@/features/news/services/SupabaseArticleRepository";
import { newsKeys } from "@/features/news/services/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/shared/lib/staletimes";

export const useSearchNews = (
  keyword: string,
  repo: ArticleRepository = supabaseArticleRepository,
) => {
  // Trimmed here so the queryKey (used for caching) and the value sent to the repo are always identical.
  const term = keyword.trim();

  const {
    isLoading,
    data: news,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: newsKeys.search(term),
    queryFn: ({ pageParam }) =>
      repo.searchByKeyword({ keyword: term, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages) =>
      lastPage.length === 10 ? _pages.length + 1 : undefined,
    staleTime: STALE_TIMES.NEWS,
    enabled: term.length > 0, // TopicPage always mounts both hooks (headlines and search). This guard prevents search from firing when the user is on a category page and keyword is empty.
  });

  const flatNews = news?.pages.flatMap((page: Article[]) => page) || [];

  return {
    isLoading,
    news: flatNews,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};
