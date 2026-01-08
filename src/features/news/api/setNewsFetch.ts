// import { API_KEY } from "../../../shared/config/apiConfig";
import { News } from "../types/d.news.types";
import { today } from "../Utils/formatter";
import { mapNews } from "../Utils/mapNews";

export const newsFetch = async (topic:string): Promise<News> => {

 const hoy = today();

 const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '1b79792af1mshf6031c2983fdd36p130668jsn371b3753995b',
		'x-rapidapi-host': 'techcrunch1.p.rapidapi.com'
	}
 }
 const url = `https://techcrunch1.p.rapidapi.com/v2/posts?order=desc&status=publish&orderby=date&page=1&per_page=10&after=${hoy}&categories=${topic}`

  // const url = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&expand=content&max=50&in=title,description&q=${topic}&from=${hoy}&apikey=${API_KEY}`;

  const query = await fetch(url, options);
  const results = await query.json();
  const newsArray = results.data;
  const news = mapNews(newsArray);


  return news;
};
