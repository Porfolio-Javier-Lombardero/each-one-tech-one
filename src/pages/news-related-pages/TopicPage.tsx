import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEmptyMessage } from "@/features/news/utils/getEmptyMessage";
import { useGetHeadlines } from "@/features/news/hooks/useGetHeadlines";
import { useSearchNews } from "@/features/news/hooks/useSearchNews";
import { Categories, TopicId } from "@/domain/Topics";
import { NewsList } from "@/features/news/components/NewsList";
import { Article, DateFilterType } from "@/domain/Article";
import {
  Datefilter,
  DateFilterMode,
} from "@/features/news/components/Datefilter";
import { LatestNewsSkeleton } from "@/shared/components/LatestNewsSkeleton";
import { OtherNewsSkeleton } from "@/shared/components/OtherNewsSkeleton";

export const TopicPage = () => {
  const { value } = useParams();

  const [dateFilter, setDateFilter] = useState<DateFilterType>("today");

  const isKnownCategory =
    !!value && (Object.values(Categories) as string[]).includes(value);
  
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

  const {
    isLoading: loadingKeywordNews,
    news: keywordNews,
    fetchNextPage: fetchNextKeyword,
    hasNextPage: hasNextKeyword,
    isFetchingNextPage: isFetchingKeyword,
  } = useSearchNews(isKeywordSearch ? (value ?? "") : "");

  let noticias: Article[] = [];
  let loadingNews = false;
  let fetchNext: () => void = () => {};
  let hasNext = false;
  let isFetching = false;

  if (isKeywordSearch && value) {
    noticias = keywordNews;
    loadingNews = loadingKeywordNews;
    fetchNext = fetchNextKeyword;
    hasNext = !!hasNextKeyword;
    isFetching = isFetchingKeyword;
  } else {
    noticias = news;

    loadingNews = loadingCategoryNews;
    fetchNext = fetchNextPage;
    hasNext = !!hasNextPage;
    isFetching = isFetchingNextPage;
  }

  const dateFilterMode: DateFilterMode =
    value === "Smartphones" ? "smartphones" : "standard";

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
          {!isKeywordSearch && (
            <Datefilter
              setDateFilter={setDateFilter}
              dateFilter={dateFilter}
              mode={dateFilterMode}
            />
          )}
        </div>
      </div>

      <section className="container-fluid  pt-3  px-5 d-flex flex-column  bg-secondary">
        <div className="row mt-1 p-2 py-4  gy-3  border-top border-primary border-2 align-items-end ">
          {noticias.length > 0 ? (
            <NewsList
              news={noticias}
              loadingNews={loadingNews}
              fetchNext={fetchNext}
              hasNext={hasNext}
              isFetching={isFetching}
              emptyMessage={getEmptyMessage(dateFilter)}
            />
          ) : loadingNews ? (
            <>
              <div className="col-12 col-lg-6">
                <LatestNewsSkeleton />
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="col-12 col-md-4 col-lg-3" key={`skeleton-${i}`}>
                  <OtherNewsSkeleton />
                </div>
              ))}
            </>
          ) : (
            <p>{getEmptyMessage(dateFilter)}</p>
          )}
        </div>

        <div className="separador"></div>
      </section>
    </>
  );
};
