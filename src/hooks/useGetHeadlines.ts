

import { DateFilterType } from "@/services/news/interfaces/d.news.types";
import { fetchNewsWithCache } from "@/services/news/cache/fetchNewsWithCache";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getTopicId } from "../services/news/helpers/setCategoryFilter";
import { STALE_TIMES } from "@/services/consts/staletimes.";

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



    return {
        isLoading,
        news,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage
    };
};


