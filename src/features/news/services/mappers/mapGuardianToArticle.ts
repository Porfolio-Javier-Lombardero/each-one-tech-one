import type { GuardianArticle } from '../dtos/d.news.types';
import type { Article } from '@/domain/Article';
import { generateShortId } from './generateShortId';
import { formatDate } from './formatDate';

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
