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

  const [seeAll, setSeeAll] = useState(false)

  const handleSeeAll = () => {
    setSeeAll(!seeAll)
  }


  // 3. HELPER para mensajes de UI
  const getEmptyMessage = (dateFilter: string): string => {
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


  // Resetear filtro a 'today' cuando cambie el topic
  useEffect(() => {
    if (dateFilter !== 'today') {
      setDateFilter('today');
    }
    setSeeAll(false)
  }, [topic]);

  if (loading) return <Loader />;

  if (!topicNews) return <Loader />;



  return (
    <>
      <div className="container-fluid m-0 pb-0 topic-page-gradient" id="hero">
        <div className="row  ps-4 pt-5 pb-0 m-0 gy-2 ">
          <div className="col-12 p-3  ">
            <h1 className="h1 display-2 text-center text-sm-start">{topic}</h1>
          </div>
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
        </div>
      </div>

      <section className="container-fluid  pt-3  px-5 d-flex flex-column  bg-secondary">
        <div className="row mt-1 p-2 py-4  gy-3  border-top border-primary border-2 align-items-end ">
          {topicNews.length === 0 ? (
            <div className="col-12 text-center py-2">
              <h3 className="text-muted">{getEmptyMessage(dateFilter)}</h3>
            </div>
          ) : (
            topicNews &&
            topicNews.map((noticia, index) => {
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
            topicNews?.slice(10).map((noticia) => (
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
