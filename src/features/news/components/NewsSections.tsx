

import { useGetHeadlines } from "../hooks/useGetHeadlines";
import { TopicCard } from "./cards/TopicCard";
import { NewsList } from "./NewsList";

export const NewsSections = ()  => {
  
    
      const { isLoading: loadingNews, news, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetHeadlines({ topic: 0, dateFilter: "all" });
  
  
    return (
        <>
         <section className="container-fluid pb-4 p-1 p-sm-4  pb-4" id="latest-news">
            <div className="row p-4 mb-3">
              <div className="col-12 py-2 border-top border-primary border-2">
                <h2 className="h2 display-3">LATEST NEWS</h2>
              </div>
            </div>
            {<NewsList
             news={news} 
             loadingNews={loadingNews} 
             fetchNext={fetchNextPage} 
             hasNext={hasNextPage} 
             isFetching={isFetchingNextPage} />}
          </section>
    
          <section className="container-fluid p-1 p-sm-4 pb-4 " id="topics">
            <div className="row p-4 mb-3">
              <div className="col-12 py-2 border-top border-primary border-2">
                <h2 className="h2 display-3">TRENDY NOW</h2>
              </div>
            </div>
            <div className="row px-1 d-flex">
              {news &&
                news
                  .map((noticia) => {
                    return (
                      <div className="col-12  col-md-6  col-lg-3" key={noticia.id_hash}>
                        <TopicCard noticia={noticia} />
                      </div>
                    );
                  })
                  .splice(0, 4)}
            </div>
          </section>
          </>
  )
}
