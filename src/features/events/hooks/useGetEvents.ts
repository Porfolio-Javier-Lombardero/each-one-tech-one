import { fetchEvents } from "@/features/events/services/queries/fetchEvents";
import { useQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/shared/lib/staletimes";

export const useGetEvents = () => {
  const {
    isLoading,
    isError,
    data: events,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: STALE_TIMES.EVENTS,
  });

  return {
    isLoading,
    isError,
    events,
  };
};
