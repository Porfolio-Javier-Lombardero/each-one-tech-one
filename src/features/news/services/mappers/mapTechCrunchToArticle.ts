import type { TechCrunchArticle } from '../dtos/d.news.types';
import type { Article } from '@/domain/Article';
import { generateShortId } from './generateShortId';

const formatDate = (param: string): string => {
  const date = new Date(param);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  return `${month}, ${date.getDate()}, ${date.getFullYear()}`;
};

export function mapTechCrunchToArticle(articles: TechCrunchArticle[]): Article[] {
  return articles.map((item) => ({
    id_hash: generateShortId(item.link),
    titulo: item.title.rendered,
    description: item.excerpt.rendered,
    cont: item.content.rendered,
    categories: item.categories,
    fechaIso: item.date,
    fecha: formatDate(item.date),
    url: item.link,
    img: item.yoast_head_json?.og_image?.[0]?.url ?? null,
  }));
}
