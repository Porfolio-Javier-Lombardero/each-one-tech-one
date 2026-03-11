import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetHeadlines } from "@/hooks/useGetHeadlines";
import { Categories } from "@/services/news/interfaces/topics";
import { Newslist } from "@/components/news/Newslist";
import {
  DateFilterType,
  SingleNew,
} from "@/services/news/interfaces/d.news.types";
import { Datefilter } from "@/components/news/Datefilter";

export const TopicPage = () => {
  const { value } = useParams();

  const [dateFilter, setDateFilter] = useState<DateFilterType>("today");

  const {
    isLoading: loadingNews,
    news: newsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetHeadlines({ topic: value || "", dateFilter: dateFilter });
  const news = newsData?.pages.flatMap((page: SingleNew[]) => page) || [];

  let noticias = news;

  if (value && !Object.values(Categories).includes(value)) {
    const keywords = value.toLocaleLowerCase().split(/[,\s.]+/);

    const searchByKeyword =
      noticias?.filter((noticia: SingleNew) => {
        return keywords.some((kw) =>
          noticia.titulo.toLocaleLowerCase().split(" ").includes(kw),
        );
      }) || [];
    noticias = searchByKeyword;
  }

  useEffect(() => {
    setDateFilter(value === "Smartphones" ? "all" : "today");
  }, [value]);

  return (
    <>
      <div className="container-fluid m-0 pb-0 topic-page-gradient" id="hero">
        <div className="row  ps-4 pt-5 pb-0 m-0 gy-2 ">
          <div className="col-12 p-3  ">
            <h1 className="h1 display-2 text-center text-sm-start">{value}</h1>
          </div>
          {
            <Datefilter
              setDateFilter={setDateFilter}
              dateFilter={dateFilter}
              value={value}
            />
          }
        </div>
      </div>

      <section className="container-fluid  pt-3  px-5 d-flex flex-column  bg-secondary">
        <div className="row mt-1 p-2 py-4  gy-3  border-top border-primary border-2 align-items-end ">
          {
            <Newslist
              news={noticias}
              loadingNews={loadingNews}
              fetchNext={fetchNextPage}
              hasNext={hasNextPage}
              isFetching={isFetchingNextPage}
              dateFilter={dateFilter}
      
            />
          }
        </div>

        <div className="separador"></div>
      </section>
    </>
  );
};
