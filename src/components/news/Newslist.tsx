import { News } from '@/services/news/interfaces/d.news.types';
import { LatestNewsSkeleton } from './cards/LatestNewsSkeleton';
import { OtherNewsSkeleton } from './cards/OtherNewsSkeleton';
import { LatestNewsCard } from './cards/LatestNewsCard';
import { OtherNewsCard } from './cards/OtherNewsCard';
import { getEmptyMessage } from '@/pages/news-related-pages/helpers/getEmpyMessage';

export interface Props {
    news?: News;
    loadingNews: boolean;
    fetchNext: () => void;
    hasNext: boolean;
    isFetching: boolean;
    dateFilter?: string;

}


export const Newslist = ({ news, loadingNews, fetchNext, hasNext, isFetching, dateFilter }: Props) => {

    const handleFetchMore = () => {
        if (hasNext) fetchNext()
        return
    }

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
                        <span className="text-secondary h4">
                            {getEmptyMessage(dateFilter || '')}
                        </span>
                    </div>
                ) : (
                    <>
                        {news?.[0] && (
                            <div className="col-12 col-lg-6" key={news[0].id_hash}>
                                <LatestNewsCard key={news[0].id_hash} noticia={news[0]} />
                            </div>
                        )}
                        {news && news.slice(1).map((noticia) => (
                            <div
                                className="col-12 col-md-4 col-lg-3"
                                key={noticia.id_hash}
                            >
                                <OtherNewsCard key={noticia.id_hash} noticia={noticia} />
                            </div>
                        ))}
                        {isFetching && (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div className="col-12 col-md-4 col-lg-3" key={`skeleton-next-${i}`}>
                                    <OtherNewsSkeleton />
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
            <button
                className="col-2 btn btn-primary m-3"
                onClick={handleFetchMore}
                disabled={!news || news.length < 10 || !hasNext}
            >
                <span className="text-secondary">view more</span>
            </button>
            <div className="row p-4  g-2 px-6 align-items-end "></div>
        </>

    )

}
