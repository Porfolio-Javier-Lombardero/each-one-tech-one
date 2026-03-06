import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetHeadlines } from "@/hooks/useGetHeadlines";
import { Categories } from "@/services/news/interfaces/topics";
import { Newslist } from "@/components/news/Newslist";
import { DateFilterType } from "@/services/news/interfaces/d.news.types";

export const TopicPage = () => {
  const { value } = useParams();


  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');

  const { isLoading, news } = useGetHeadlines({ topic: value || '', dateFilter: dateFilter })

  let noticias = news

  if (value && !Object.values(Categories).includes(value)) {

    const keywords = value.toLocaleLowerCase().split(/[,\s.]+/)

    const searchByKeyword = noticias?.filter(noticia => {
      return keywords.some(kw => noticia.titulo.toLocaleLowerCase().split(" ").includes(kw))
    }) || []
    noticias = searchByKeyword
  }


useEffect(() => {
    setDateFilter("today")
  }, [value])


  return (
    <>
      <div className="container-fluid m-0 pb-0 topic-page-gradient" id="hero">
        <div className="row  ps-4 pt-5 pb-0 m-0 gy-2 ">
          <div className="col-12 p-3  ">
            <h1 className="h1 display-2 text-center text-sm-start">
              {value === 'foundAtWeb' ? 'Search Results' : value}
            </h1>
          </div>
          {value !== 'foundAtWeb' && (
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
          { <Newslist news={noticias} loadingNews={isLoading}/>}
        
        </div>

        <div className="separador"></div>
      </section>
    </>
  );
};
