
import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '@/features/reviews/services/queries/fetchReviews';
import { STALE_TIMES } from '@/shared/lib/staletimes';

export const useGetReviews = () => {
  const { isLoading: loadingReviews, data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    staleTime: STALE_TIMES.REVIEWS
  })




  return {
    reviews,
    loadingReviews
  }

}
