import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEmptyMessage } from "@/features/news/utils/getEmptyMessage";
import { useGetHeadlines } from "@/features/news/hooks/useGetHeadlines";
import { useSearchAllCategories } from "@/features/news/hooks/useSearchAllCategories";
import { Categories, TopicId } from "@/domain/Topics"
import { NewsList } from "@/features/news/components/NewsList";
import { Article, DateFilterType } from "@/domain/Article";
import { Datefilter } from "@/features/news/components/Datefilter";

export const TopicPage = () => {
  const { value } = useParams();

  const [dateFilter, setDateFilter] = useState<DateFilterType>("today");

  const isKnownCategory = !!value && (Object.values(Categories) as string[]).includes(value);
  const isKeywordSearch = !!value && !isKnownCategory;

  const {
    isLoading: loadingCategoryNews,
    news,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetHeadlines({
    topic: isKnownCategory ? (value as TopicId) : 0,
    dateFilter: dateFilter,
  });

  const { isLoading: loadingKeywordNews, news: keywordPool } =
    useSearchAllCategories();

  let noticias: Article[] = [];
  let loadingNews = false;
  let fetchNext: () => void = () => { };
  let hasNext = false;
  let isFetching = false;

  if (isKeywordSearch && value) {
    const keywords = value
      .toLowerCase()
      .split(/[,\s.]+/)
      .map((k) => k.trim())
      .filter(Boolean);

    noticias = keywords.length
      ? keywordPool.filter((noticia) => {
        if (!noticia?.titulo) return false;
        const title = noticia.titulo.toLowerCase();
        return keywords.some((kw) => title.includes(kw));
      })
      : [];

    loadingNews = loadingKeywordNews;
  } else {
    noticias = news

    loadingNews = loadingCategoryNews;
    fetchNext = fetchNextPage;
    hasNext = !!hasNextPage;
    isFetching = isFetchingNextPage;
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
            noticias.length > 0 ? (<NewsList
              news={noticias}
              loadingNews={loadingNews}
              fetchNext={fetchNext}
              hasNext={hasNext}
              isFetching={isFetching}
              dateFilter={dateFilter}

            />)
              :
              (<p>{getEmptyMessage(dateFilter)}</p>)
          }
        </div>

        <div className="separador"></div>
      </section>
    </>
  );
};
