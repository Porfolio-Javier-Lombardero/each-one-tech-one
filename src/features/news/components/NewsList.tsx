import { News } from "@/domain/Article";
import { LatestNewsSkeleton } from "@/shared/components/LatestNewsSkeleton";
import { OtherNewsSkeleton } from "@/shared/components/OtherNewsSkeleton";
import { LatestNewsCard } from "./cards/LatestNewsCard";
import { OtherNewsCard } from "./cards/OtherNewsCard";
export interface Props {
  news?: News;
  loadingNews: boolean;
  fetchNext: () => void;
  hasNext: boolean;
  isFetching: boolean;
  emptyMessage?: string;
}

export const NewsList = ({
  news,
  loadingNews,
  fetchNext,
  hasNext,
  isFetching,
  emptyMessage = 'No articles found',
}: Props) => {
  const handleFetchMore = () => {
    if (hasNext) fetchNext();
    return;
  };

  const isEmpty = !loadingNews && (!news || news.length === 0);

  return (
    <>
      <div className="row align-items-end justify-content-between px-3 gx-2 gy-5">
        {loadingNews ? (
          <>
            <div className="col-12 col-lg-6">
              <LatestNewsSkeleton />
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="col-12 col-md-4 col-lg-3" key={`skeleton-${i}`}>
                <OtherNewsSkeleton />
              </div>
            ))}
          </>
        ) : isEmpty ? (
          <div className="col-12 text-center py-5">
            <span className="text-secondary h4">{emptyMessage}</span>
          </div>
        ) : (
          <>
            {/* The first article renders as a wide LatestNewsCard; the rest render as smaller OtherNewsCards.
                The visual hierarchy comes from array position, not from a field on the article. */}
            {news?.[0] && (
              <div className="col-12 col-lg-6" key={news[0].id_hash}>
                <LatestNewsCard key={news[0].id_hash} noticia={news[0]} />
              </div>
            )}
            {news &&
              news.slice(1).map((noticia) => (
                <div className="col-12 col-md-4 col-lg-3" key={noticia.id_hash}>
                  <OtherNewsCard key={noticia.id_hash} noticia={noticia} />
                </div>
              ))}
            {isFetching &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  className="col-12 col-md-4 col-lg-3"
                  key={`skeleton-next-${i}`}
                >
                  <OtherNewsSkeleton />
                </div>
              ))}
          </>
        )}
      </div>
      <button
        className="col-md-2 btn btn-primary m-3"
        onClick={handleFetchMore}
        disabled={!news || news.length < 10 || !hasNext}
      >
        <span className="text-secondary">view more</span>
      </button>
      <div className="row p-0  g-2 px-6 align-items-end "></div>
    </>
  );
};
