
import { useGetReviews } from '../hooks/useGetReviews';
import { OtherNewsSkeleton } from '@/features/news/components/cards/OtherNewsSkeleton';
import { VideoPlayer } from './VideoPlayer';
import { Review } from "@/domain/Review";

export const ReviewsSection = () => {

      const { loadingReviews, reviews } = useGetReviews();
  return (
    
      <section className="container-fluid p-1 p-sm-4 " id="reviews">
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">REVIEWS & RELEASES</h2>
          </div>
        </div>

        <div className="row px-3 justify-content-center">
          {
            loadingReviews ?
              (<OtherNewsSkeleton />)
              :
              (reviews && reviews.map((item: Review) => (
                <VideoPlayer
                  key={item.video_id}
                  video={item}
                  showDetails={true}
                />
              )))
          }
        </div>
      </section>
  )
}
