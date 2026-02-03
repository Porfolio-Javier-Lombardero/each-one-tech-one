import { News, SingleNew, TechCrunchArticle, TechCrunchArticleArray } from "../../lib/types/d.news.types";
import { formatDate } from "@/utils/formatDates";




export const mapNews = (newsArray: TechCrunchArticleArray): News | void => {
  if (!newsArray) return;

  return newsArray.map((item: TechCrunchArticle): SingleNew => ({
    id: crypto.randomUUID(),
    titulo: item.title.rendered,
    description: item.excerpt.rendered, // Cambiado de desc a description
    cont: item.content.rendered,
    categories: item.categories,
    fechaIso: item.date,
    fecha: formatDate(item.date),
    url: item.link,
    img: item.yoast_head_json.og_image?.splice(-1)[0]?.url
  }));
};
