import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LatestNewsCard } from "../../components/news/LatestNewsCard";
import { OtherNewsCard } from "../../components/news/OtherNewsCard";
import { LatestNewsSkeleton } from "../../components/news/LatestNewsSkeleton";
import { OtherNewsSkeleton } from "../../components/news/OtherNewsSkeleton";
import { DateFilterType } from "@/services/news/interfaces/d.news.types";
import { getEmptyMessage } from "./helpers/getEmpyMessage";
import { useGetHeadlines } from "@/hooks/useGetHeadlines";

export const TopicPage = () => {
  const { topic } = useParams();

  
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  
  const {isLoading, news } = useGetHeadlines({topic: topic || '', dateFilter: dateFilter})

  const [seeAll, setSeeAll] = useState(false)

  const handleSeeAll = () => {
    setSeeAll(!seeAll)
  }

  useEffect(() => {
  setDateFilter("today")
  }, [topic])
  

 return (
    <>
      <div className="container-fluid m-0 pb-0 topic-page-gradient" id="hero">
        <div className="row  ps-4 pt-5 pb-0 m-0 gy-2 ">
          <div className="col-12 p-3  ">
            <h1 className="h1 display-2 text-center text-sm-start">
              {topic === 'foundAtWeb' ? 'Search Results' : topic}
            </h1>
          </div>
          {topic !== 'foundAtWeb' && (
            <div className="col-12 d-flex ps-2 pt-3 pb-0  mb-0">
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'today' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('today')}
              >
                Today
              </button>
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'yesterday' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('yesterday')}
              >
                Yesterday
              </button>
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'lastWeek' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('lastWeek')}
              >
                Older
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'today' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('today')}
              >
                Today
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'yesterday' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('yesterday')}
              >
                Yesterday
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'lastWeek' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('lastWeek')}
              >
                Older
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="container-fluid  pt-3  px-5 d-flex flex-column  bg-secondary">
        <div className="row mt-1 p-2 py-4  gy-3  border-top border-primary border-2 align-items-end ">
          {(isLoading || !news) ? (
            <>
              <div className="col-12 col-lg-6">
                <LatestNewsSkeleton />
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="col-12 col-md-4 col-lg-3" key={`topic-skeleton-${i}`}>
                  <OtherNewsSkeleton />
                </div>
              ))}
            </>
          ) : news.length === 0 ? (
            <div className="col-12 text-center py-2">
              <h3 className="text-muted">{getEmptyMessage(dateFilter, topic)}</h3>
            </div>
          ) : (
            news &&
            news.map((noticia, index) => {
              if (index === 0) {
                return (
                  <div className="col-12 col-lg-6" key={index}>
                    <LatestNewsCard key={noticia.id} noticia={noticia} />
                  </div>
                );
              } else if (index < 10) {
                return (
                  <div className="col-12 col-md-4 col-lg-3" key={index * 99}>
                    <OtherNewsCard key={noticia.id} noticia={noticia} />
                  </div>
                );
              }
              return null;
            }))}
          {seeAll &&
            news?.slice(10).map((noticia) => (
              <div className="col-12 col-md-4 col-lg-3" key={noticia.id}>
                <OtherNewsCard noticia={noticia} />
              </div>
            ))}
        </div>
        {
          dateFilter === 'lastWeek' ? (
            <button className="col-2 btn btn-primary m-3" onClick={handleSeeAll}>{seeAll ? "view less" : "view All"}</button>
          )
            :
            (" ")
        }

        <div className="separador"></div>
      </section>
    </>
  );
};
