import React, { useEffect } from "react";
import { LatestNewsCard } from "../Components/LatestNewsCard";
import { OtherNewsCard } from "../Components/OtherNewsCard";

import useSearchStore from "../../../Store/useSearchStore";
// import SmartPhones from "../Mocks/SmartPhones.json";
import { useFilterStore } from "../../../Store/useFilterStore";
import { useParams } from "react-router-dom";
import { Loader } from "../Components/Loader";


export const TopicPage = () => {
  // const [news, setnews] = useState(SmartPhones.articles);
  const { topic } = useParams();

  const { news, SearchHeadlines, loading } = useSearchStore();

  const {
    yesterdayNews,
    lastWeekNews,
    resetFilter,
    filtredNews,
  } = useFilterStore();

  
useEffect(() => {
 

      SearchHeadlines(topic)
      resetFilter()
 
  }, [topic]);

  return (
    <>
      <div className="container-fluid m-0 pb-0"  id="hero">
        <div className="row  ps-4 pt-5 pb-0 m-0 gy-2 ">
          <div className="col-12 p-3  ">
            <h1 className="h1 display-2 text-center text-sm-start">{topic}</h1>
          </div>
          <div className="col-12 d-flex ps-2 pt-3 pb-0  mb-0">
            <button
              className="btn btn-outline-primary d-none d-sm-inline text-primary ms-2"
              onClick={() => resetFilter()}
            >
              Today
            </button>
            <button
              className="btn btn-outline-primary d-none d-sm-inline text-primary ms-2"
              onClick={() => yesterdayNews(news)}
            >
              Yesterday
            </button>
            <button
              className="btn btn-outline-primary d-none d-sm-inline text-primary ms-2"
              onClick={() => lastWeekNews(news)}
            >
            Older
            </button>
            <button className="btn btn-outline-primary btn-sm d-inline d-sm-none text-primary  ms-2">
              Today
            </button>
            <button className="btn btn-outline-primary btn-sm d-inline d-sm-none text-primary ms-2">
              Yesterday
            </button>
            <button className="btn btn-outline-primary btn-sm d-inline d-sm-none text-primary  ms-2">
            Older
            </button>
          </div>
        </div>
      </div>

      <section className="container-fluid  pt-3  px-5 d-flex flex-column justify-content-end bg-secondary">
        <div className="row mt-1 p-2 py-4  gy-3  border-top border-primary border-2 align-items-end ">
          {
          loading?( <Loader/>):
           filtredNews ? (
            filtredNews.map((noticia, index) => {
              return index === 0 ? (
                <div  key={noticia.id} className="col-12 col-md-6 py-3">
                  <LatestNewsCard noticia={noticia} />
                </div>
              ) : (
                <div className="col-12 col-md-3 mb-2 p-0 p-sm-3" key={noticia.id}>
                  <OtherNewsCard  noticia={noticia} />
                </div>
              );
            })
          ) : news ? (
            news.map((noticia, index) => {
              return index === 0 ? (
                <div className="col-12 col-md-6 p-0  py-3" key={noticia.id}>
                  <LatestNewsCard  noticia={noticia} />
                </div>
              ) : (
                <div className="col-12 col-md-3 mb-2 mt-3 p-0 p-sm-3" key={noticia.id} >
                  <OtherNewsCard noticia={noticia} />
                </div>
              );
            })
          ) : (
            <p>Hecho a dreder</p>
          )}
        </div>
        {/* <button className="btn btn-lg border border-primary border-2 rounded-pill align-self-end m-4">
          see all
        </button> */}
        <div className="separador"></div>
      </section>
    </>
  );
};
