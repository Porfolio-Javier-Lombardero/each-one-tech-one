
import { formatDate } from "@/services/news/helpers/formatDates";
import { News, SingleNew, TechCrunchArticle, TechCrunchArticleArray } from "../interfaces/d.news.types";
import { generateShortId } from "@/utils/generateShortId";




export const mapNews = (newsArray: TechCrunchArticleArray): News => {
  if (!newsArray) return [];

  return newsArray.map((item: TechCrunchArticle): SingleNew => ({
    id_hash: generateShortId(item.link),
    titulo: item.title.rendered,
    description: item.excerpt.rendered,
    cont: item.content.rendered,
    categories: item.categories,
    fechaIso: item.date,
    fecha: formatDate(item.date),
    url: item.link,
    img: item.yoast_head_json.og_image?.splice(-1)[0]?.url || null
  }));
};
