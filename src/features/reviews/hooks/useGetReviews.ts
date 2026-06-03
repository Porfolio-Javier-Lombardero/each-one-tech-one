
import { useQuery } from '@tanstack/react-query';
import { fetchReviewsWithCache } from '@/features/reviews/services/cache/fetchReviewsWithCache';
import { STALE_TIMES } from '@/shared/lib/staletimes';

export const useGetReviews = () => {
  const { isLoading: loadingReviews, data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviewsWithCache,
    staleTime: STALE_TIMES.REVIEWS
  })




  return {
    reviews,
    loadingReviews
  }

}
