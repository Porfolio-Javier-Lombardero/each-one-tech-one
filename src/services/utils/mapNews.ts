import { News, SingleNew, TechCrunchArticle, TechCrunchArticleArray } from "../../lib/types/d.news.types";
import { formatDate } from "@/utils/formatDates";




export const mapNews = (newsArray: TechCrunchArticleArray ): News | void => {
  if (!newsArray) return;

  return newsArray.map((item: TechCrunchArticle): SingleNew => ({
    id: crypto.randomUUID(),
    titulo: item.title.rendered,
    desc: item.excerpt.rendered,
    cont: item.content.rendered,
    fechaIso: item.date,
    tags:item.tags,
    fecha: formatDate(item.date),
    url: item.link,
    img: item.yoast_head_json.og_image?.splice(-1)[0]?.url
  }));
};
