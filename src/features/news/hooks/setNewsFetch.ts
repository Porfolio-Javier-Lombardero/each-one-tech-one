import { API_KEY } from "../../../shared/config/apiConfig";
import { checkLocalStorage, setStorage } from "../../../Services/setLocalStorage";
import { mapNews } from "../../../Services/mapNews";
import { SetQuery } from "../../../Services/SetQuery";
import { today } from "../Utils/formatter";

export const newsFetch = async (topic) => {
  const check = checkLocalStorage(topic);

  if (check) {
    return check.results;
  }

  const query = SetQuery(topic);
  const hoy = today();

  const url = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&expand=content&max=50&in=title,description&q=${query}&from=${hoy}&apikey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  const news = data.articles;
  const results = mapNews(news);
  setStorage({ topic, results });

  return results;
};
