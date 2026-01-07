import { formatDate } from "../features/news/Utils/formatter";
import { RandomNumb } from "../features/news/Utils/randomNumb";
export const mapNews = (noticias) => {
  if (!noticias) return;

  return noticias.map((item) => ({
    id: RandomNumb(),
    titulo: item.title,
    desc: item.description,
    cont: item.content,
    fechaIso: item.publishedAt,
    fecha: formatDate(item.publishedAt),
    fuente: item.source.name,
    url: item.url,
    img: item.image,
  }));
};
