
import { useGetReviews } from '../hooks/useGetReviews';
import { OtherNewsSkeleton } from '@/shared/components/OtherNewsSkeleton';
import { VideoPlayer } from './VideoPlayer';
export const ReviewsSection = () => {

      const { isLoading, reviews } = useGetReviews();
  return (

      <section className="container-fluid p-1 p-sm-4 " id="reviews">
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">REVIEWS & RELEASES</h2>
          </div>
        </div>

        <div className="row px-3 justify-content-center">
          {
            isLoading ?
              (<OtherNewsSkeleton />)
              :
              (reviews && reviews.map((item) => (
                <VideoPlayer
                  key={item.video_id}
                  videoId={item.video_id}
                  title={item.title}
                  thumbnailUrl={item.thumbnail_url}
                  channelTitle={item.channel_title}
                />
              )))
          }
        </div>
      </section>
  )
}
