import { News } from '@/services/news/interfaces/d.news.types';
import { LatestNewsSkeleton } from './cards/LatestNewsSkeleton';
import { OtherNewsSkeleton } from './cards/OtherNewsSkeleton';
import { LatestNewsCard } from './cards/LatestNewsCard';
import { OtherNewsCard } from './cards/OtherNewsCard';


export interface Props {
    news?: News;
    loadingNews: boolean;
}


export const Newslist = ({ news, loadingNews }: Props) => {



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
                ) : (
                    <>
                        {news && (
                            <div className="col-12 col-lg-6" key={news[0].id_hash}>
                                <LatestNewsCard key={news[0].id_hash} noticia={news[0]} />
                            </div>
                        )}
                        {news && news.slice(1, 10).map((noticia) => (
                            <div
                                className="col-12 col-md-4 col-lg-3"
                                key={noticia.id_hash}
                            >
                                <OtherNewsCard key={noticia.id_hash} noticia={noticia} />
                            </div>
                        ))}
                        
                    </>
                )}
            </div>
            <button className="col-2 btn btn-primary m-3" >
                 view All
            </button>
            <div className="row p-4  g-2 px-6 align-items-end "></div>
        </>

    )

}
