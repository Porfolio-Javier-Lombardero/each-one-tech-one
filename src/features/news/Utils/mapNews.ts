import { News, TechCrunchArticleArray } from "../types/d.news.types";
import { formatDate } from "./formatter";




export const mapNews = (newsArray:TechCrunchArticleArray):News | void => {
  if (!newsArray) return;

  return newsArray.map((item) => ({
    id: crypto.randomUUID(),
    titulo: item.title.rendered,
    desc: item.excerpt.rendered,
    cont: item.content.rendered,
    fechaIso: item.date,
    fecha: formatDate(item.date),
    url: item.link,
    img: item.yoast_head_json.og_image?.splice(-1)[0],
  }));
};
