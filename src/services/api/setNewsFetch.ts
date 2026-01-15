// import { API_KEY } from "../../../shared/config/apiConfig";
import { News } from "../../lib/types/d.news.types";
import { today } from "../utils/formatDate";
import { mapNews } from "../utils/mapNews";

export const newsFetch = async (topic:number): Promise<News | void> => {
 
  const hoy = today();
  console.log(hoy)
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '1b79792af1mshf6031c2983fdd36p130668jsn371b3753995b',
      'x-rapidapi-host': 'techcrunch1.p.rapidapi.com'
    }
  }
  const url = `https://techcrunch1.p.rapidapi.com/v2/posts?order=desc&status=publish&categories=${topic}&orderby=date&page=1&per_page=10&after=${hoy}`



  const query = await fetch(url, options);
  const results = await query.json();
  const newsArray = results.data;
  const news = mapNews(newsArray);


  return news;
};
