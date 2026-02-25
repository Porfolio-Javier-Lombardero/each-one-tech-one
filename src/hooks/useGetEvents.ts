import { fetchEventsWithCache } from "@/services/events/fetchEventsWithCache";
import { useQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/services/consts/staletimes.";

export const useGetEvents = () => {
    const { isLoading, isError, data: events } = useQuery({
        queryKey: ["events"],
        queryFn: fetchEventsWithCache,
        gcTime: STALE_TIMES.EVENTS * 2,
        staleTime: STALE_TIMES.EVENTS
    })



    return {
        isLoading,
        isError,
        events
    };

}
