import { EventRepository } from "@/domain/ports/EventRepository";
import { supabaseEventRepository } from "@/features/events/services/SupabaseEventRepository";
import { useQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/shared/lib/staletimes";

export const useGetEvents = (repo: EventRepository = supabaseEventRepository) => {
    const { isLoading, isError, data: events } = useQuery({
        queryKey: ["events"],
        queryFn: () => repo.getAll(),
        staleTime: STALE_TIMES.EVENTS,
    });

    return {
        isLoading,
        isError,
        events,
    };
};
