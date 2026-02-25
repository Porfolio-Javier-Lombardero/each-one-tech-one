

import { DateFilterType } from "@/services/news/interfaces/d.news.types";
import { fetchNewsWithCache } from "@/services/news/fetchNewsWithCache";
import { useQuery } from "@tanstack/react-query";
import { getTopicId } from "../services/news/helpers/setCategoryFilter";
import { STALE_TIMES } from "@/services/consts/staletimes.";

interface Props {
    topic: number | string;
    dateFilter: DateFilterType
}

export const useGetHeadlines = ({ topic, dateFilter }: Props) => {
    const topicId = getTopicId(topic)

    const { isLoading, data: news } = useQuery({
        queryKey: ["top-headlines", topicId, dateFilter],
        queryFn: () => fetchNewsWithCache(topicId, dateFilter),
        gcTime: STALE_TIMES.NEWS * 2,
        staleTime: STALE_TIMES.NEWS,

    })



    return {
        isLoading,
        news
    };
};


