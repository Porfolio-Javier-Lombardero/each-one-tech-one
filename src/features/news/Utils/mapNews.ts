import { formatDate } from "./formatter";


export const mapNews = (noticias) => {
  if (!noticias) return;

  return noticias.map((item) => ({
    id: crypto.randomUUID(),
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
