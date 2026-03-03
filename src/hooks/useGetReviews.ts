
import { useQuery } from '@tanstack/react-query';
import { fetchReviewsWithCache } from '@/services/reviews/cache/fetchReviewsWithCache';
import { STALE_TIMES } from '@/services/consts/staletimes.';

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
