import type { GuardianArticle } from '../dtos/d.news.types';
import type { Article } from '@/domain/Article';
import { generateShortId } from './generateShortId';

const formatDate = (param: string): string => {
  const date = new Date(param);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  return `${month}, ${date.getDate()}, ${date.getFullYear()}`;
};

export function mapGuardianToArticle(articles: GuardianArticle[]): Article[] {
  return articles.map((item) => ({
    id_hash: generateShortId(item.webUrl),
    titulo: item.webTitle,
    description: item.fields.trailText ?? '',
    cont: item.fields.bodyText ?? '',
    categories: [],
    fechaIso: item.webPublicationDate,
    fecha: formatDate(item.webPublicationDate),
    url: item.webUrl,
    img: item.fields.thumbnail ?? null,
  }));
}
