import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LatestNewsCard } from "../../components/news/LatestNewsCard";
import { OtherNewsCard } from "../../components/news/OtherNewsCard";
import { Loader } from "@/components/shared/Loader";
import { DateFilterType } from "@/lib/types/d.news.types";
import { useTopicNews } from "@/hooks/useTopicNews";

export const TopicPage = () => {
  const { topic } = useParams();
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const { topicNews, loading } = useTopicNews(topic, dateFilter);

  // Resetear filtro a 'today' cuando cambie el topic
  useEffect(() => {
    setDateFilter('today');
  }, [topic]);

  if (loading) return <Loader />;

  if (!topicNews) return <Loader />;

  // Mensaje cuando no hay artículos
  const getEmptyMessage = (): string => {
    switch (dateFilter) {
      case 'today':
        return 'No articles published today yet';
      case 'yesterday':
        return 'No articles published yesterday';
      case 'lastWeek':
        return 'No older articles found';
      default:
        return 'No articles found';
    }
  };

  return (
    <>
      <div className="container-fluid m-0 pb-0" id="hero">
        <div className="row  ps-4 pt-5 pb-0 m-0 gy-2 ">
          <div className="col-12 p-3  ">
            <h1 className="h1 display-2 text-center text-sm-start">{topic}</h1>
          </div>
          <div className="col-12 d-flex ps-2 pt-3 pb-0  mb-0">
            <button
              className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'today' ? 'active' : ''}`}
              onClick={() => setDateFilter('today')}
            >
              Today
            </button>
            <button
              className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'yesterday' ? 'active' : ''}`}
              onClick={() => setDateFilter('yesterday')}
            >
              Yesterday
            </button>
            <button
              className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'lastWeek' ? 'active' : ''}`}
              onClick={() => setDateFilter('lastWeek')}
            >
              Older
            </button>
            <button
              className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'today' ? 'active' : ''}`}
              onClick={() => setDateFilter('today')}
            >
              Today
            </button>
            <button
              className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'yesterday' ? 'active' : ''}`}
              onClick={() => setDateFilter('yesterday')}
            >
              Yesterday
            </button>
            <button
              className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'lastWeek' ? 'active' : ''}`}
              onClick={() => setDateFilter('lastWeek')}
            >
              Older
            </button>
          </div>
        </div>
      </div>

      <section className="container-fluid  pt-3  px-5 d-flex flex-column  bg-secondary">
        <div className="row mt-1 p-2 py-4  gy-3  border-top border-primary border-2 align-items-end ">
          {topicNews.length === 0 ? (
            <div className="col-12 text-center py-2">
              <h3 className="text-muted">{getEmptyMessage()}</h3>
            </div>
          ) : (
            topicNews.map((newsItem, i) =>
              i < 1 ? (
                <div className="col-12 col-md-4 col-lg-6" key={newsItem.id}>
                  <LatestNewsCard noticia={newsItem} />
                </div>
              ) : (
                <div className="col-12 col-md-4 col-lg-3" key={newsItem.id}>
                  <OtherNewsCard noticia={newsItem} />
                </div>
              )
            )
          )}
        </div>
        <button className="btn btn-lg border border-primary border-2 rounded-pill align-self-end m-4">
          see all
        </button>
        <div className="separador"></div>
      </section>
    </>
  );
};
