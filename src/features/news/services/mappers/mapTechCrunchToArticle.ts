import type { TechCrunchArticle } from '../dtos/d.news.types';
import type { Article } from '@/domain/Article';
import { generateShortId } from './generateShortId';
import { formatDate } from './formatDate';

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
    img: item.yoast_head_json?.og_image?.[0]?.url ?? null, // og_image is nested inside yoast_head_json and may be absent. The full optional chain handles both missing yoast data and articles without an image.
  }));
}
