import { DateFilterType, News } from "./d.news.types";

export interface CategoryCache {
  category: number | string;
   news: News;
  dateFilter: DateFilterType;

}
