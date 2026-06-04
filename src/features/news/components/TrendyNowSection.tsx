import { useGetHeadlines } from '../hooks/useGetHeadlines';
import { TopicCard } from './cards/TopicCard';

export const TrendyNowSection = () => {
    const { news } = useGetHeadlines({ topic: 0, dateFilter: 'all' });

    return (
        <section className="container-fluid p-1 p-sm-4 pb-4" id="topics">
            <div className="row p-4 mb-3">
                <div className="col-12 py-2 border-top border-primary border-2">
                    <h2 className="h2 display-3">TRENDY NOW</h2>
                </div>
            </div>
            <div className="row px-1 d-flex">
                {news.slice(0, 4).map((noticia) => (
                    <div className="col-12 col-md-6 col-lg-3" key={noticia.id_hash}>
                        <TopicCard noticia={noticia} />
                    </div>
                ))}
            </div>
        </section>
    );
};
