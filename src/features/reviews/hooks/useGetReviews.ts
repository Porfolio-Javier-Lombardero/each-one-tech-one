import { ReviewRepository } from "@/domain/ports/ReviewRepository";
import { supabaseReviewRepository } from "@/features/reviews/services/SupabaseReviewRepository";
import { useQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/shared/lib/staletimes";

export const useGetReviews = (repo: ReviewRepository = supabaseReviewRepository) => {
    const { isLoading: loadingReviews, data: reviews } = useQuery({
        queryKey: ["reviews"],
        queryFn: () => repo.getAll(),
        staleTime: STALE_TIMES.REVIEWS,
    });

    return {
        reviews,
        loadingReviews,
    };
};
