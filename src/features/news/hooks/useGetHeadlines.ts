

import { Article, DateFilterType } from "@/domain/Article";
import { fetchNewsWithCache } from "@/features/news/services/cache/fetchNewsWithCache";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getTopicId } from "@/features/news/services/helpers/setCategoryFilter";
import { STALE_TIMES } from "@/shared/lib/staletimes";

interface Props {
    topic: number | string;
    dateFilter: DateFilterType

}

export const useGetHeadlines = ({ topic, dateFilter }: Props) => {
    const topicId = getTopicId(topic)

  const { isLoading, data: news, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["top-headlines", topicId, dateFilter],
    queryFn: ({ pageParam }) => fetchNewsWithCache({ topic: topicId, dateFilter, page: pageParam as number }),
    initialPageParam: 1,                                          // ← obligatorio en v5
    getNextPageParam: (lastPage, _pages) =>
        lastPage.length === 10 ? _pages.length + 1 : undefined,   // ← basado en el tipo real
    staleTime: STALE_TIMES.NEWS,
});

 const flatNews = news?.pages.flatMap((page: Article[]) => page) || [];

    return {
        isLoading,
        news:flatNews,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage
    };
};


