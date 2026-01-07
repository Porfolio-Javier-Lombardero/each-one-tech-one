import { API_KEY } from "../../../shared/config/apiConfig";



import { today } from "../Utils/formatter";
import { mapNews } from "../Utils/mapNews";

export const newsFetch = async (topic) => {

 const hoy = today();

  const url = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&expand=content&max=50&in=title,description&q=${topic}&from=${hoy}&apikey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  const news = data.articles;
  const results = mapNews(news);


  return results;
};
