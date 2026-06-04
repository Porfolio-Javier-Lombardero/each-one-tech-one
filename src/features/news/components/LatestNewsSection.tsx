import { useGetHeadlines } from '../hooks/useGetHeadlines';
import { NewsList } from './NewsList';

export const LatestNewsSection = () => {
    const { isLoading, news, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useGetHeadlines({ topic: 0, dateFilter: 'all' });

    return (
        <section className="container-fluid pb-4 p-1 p-sm-4 pb-4" id="latest-news">
            <div className="row p-4 mb-3">
                <div className="col-12 py-2 border-top border-primary border-2">
                    <h2 className="h2 display-3">LATEST NEWS</h2>
                </div>
            </div>
            <NewsList
                news={news}
                loadingNews={isLoading}
                fetchNext={fetchNextPage}
                hasNext={hasNextPage}
                isFetching={isFetchingNextPage}
            />
        </section>
    );
};
