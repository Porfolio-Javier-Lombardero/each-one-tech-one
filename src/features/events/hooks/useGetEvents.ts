import { fetchEventsWithCache } from "@/features/events/services/cache/fetchEventsWithCache";
import { useQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/shared/lib/staletimes";

export const useGetEvents = () => {
  const {
    isLoading,
    isError,
    data: events,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEventsWithCache,
    staleTime: STALE_TIMES.EVENTS,
  });

  return {
    isLoading,
    isError,
    events,
  };
};
