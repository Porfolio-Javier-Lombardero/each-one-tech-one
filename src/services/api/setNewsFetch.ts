// import { API_KEY } from "../../../shared/config/apiConfig";
import { News, DateFilterType } from "../../lib/types/d.news.types";
import { getDateRangeByFilter } from "../utils/defineDates";
import { mapNews } from "../utils/mapNews";

export const newsFetch = async (
  topic: number,
  dateFilter: DateFilterType = 'today'
): Promise<News | void> => {

  const dateRange = getDateRangeByFilter(dateFilter);

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '1b79792af1mshf6031c2983fdd36p130668jsn371b3753995b',
      'x-rapidapi-host': 'techcrunch1.p.rapidapi.com'
    }
  }

  const url = `https://techcrunch1.p.rapidapi.com/v2/posts?order=desc&status=publish&categories=${topic}&orderby=date&page=1&per_page=25&after=${dateRange.after}${dateRange.before ? `&before=${dateRange.before}` : ''}`;

  const query = await fetch(url, options);
  const results = await query.json();
  const newsArray = results.data;
  const news = mapNews(newsArray);


  return news;
};
