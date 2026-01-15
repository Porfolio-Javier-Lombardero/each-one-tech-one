
import { useParams } from "react-router-dom";
import { LatestNewsCard } from "../../components/news/LatestNewsCard";
import { OtherNewsCard } from "../../components/news/OtherNewsCard";
import { useDefineTopicPage } from "@/services/utils/hooks/useDefineTopicPage";
import { useEffect, useState } from "react";

export const TopicPage = () => {
  const { topic } = useParams();

  const [topicNews, settopicNews] = useState([]);

  const { choseCategory } = useDefineTopicPage();

  useEffect(() => {
    const definedTopicNews = choseCategory(topic);
    console.log(definedTopicNews);
    settopicNews(definedTopicNews[0]?.news);
  }, [topic]);

  // const {
  //   yesterdayNews,
  //   lastWeekNews,
  //   resetFilter,
  //   filtredNews,
  // } = useFilterStore();

  //  useEffect(() => {

  //    SearchHeadlines(encodedBar)
  //   resetFilter()

  // }, [topic]);

  return (
    <>
      <div className="container-fluid m-0 pb-0" id="hero">
        <div className="row  ps-4 pt-5 pb-0 m-0 gy-2 ">
          <div className="col-12 p-3  ">
            <h1 className="h1 display-2 text-center text-sm-start">{topic}</h1>
          </div>
          <div className="col-12 d-flex ps-2 pt-3 pb-0  mb-0">
            <button
              className="btn btn-outline-primary d-none d-sm-inline text-primary ms-2"
            // onClick={() => resetFilter()}
            >
              Today
            </button>
            <button
              className="btn btn-outline-primary d-none d-sm-inline text-primary ms-2"
            // onClick={() => yesterdayNews(news)}
            >
              Yesterday
            </button>
            <button
              className="btn btn-outline-primary d-none d-sm-inline text-primary ms-2"
            // onClick={() => lastWeekNews(news)}
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
      
            {topicNews &&
            topicNews.map((newsItem, i) => 
             i < 1 ? 
            ( 
            <div className="col-12 col-md-4 col-lg-6">
            <LatestNewsCard noticia={newsItem}/>
            </div>)
             :
             (  
             <div className="col-12 col-md-4 col-lg-3">
                <OtherNewsCard noticia={newsItem} />
              </div>
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
