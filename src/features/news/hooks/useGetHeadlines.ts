import { Article, DateFilterType } from "@/domain/Article";
import { TopicId } from "@/domain/Topics";
import { ArticleRepository } from "@/domain/ports/ArticleRepository";
import { supabaseArticleRepository } from "@/features/news/services/SupabaseArticleRepository";
import { newsKeys } from "@/features/news/services/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/shared/lib/staletimes";

interface Props {
    topic: TopicId;
    dateFilter: DateFilterType;
}

export const useGetHeadlines = (
    { topic, dateFilter }: Props,
    repo: ArticleRepository = supabaseArticleRepository
) => {
    const { isLoading, data: news, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: newsKeys.headlines(topic, dateFilter),
            queryFn: ({ pageParam }) =>
                repo.getHeadlines({ topic, dateFilter, page: pageParam as number }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, _pages) =>
                lastPage.length === 10 ? _pages.length + 1 : undefined,
            staleTime: STALE_TIMES.NEWS,
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
