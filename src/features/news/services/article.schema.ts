import { z } from 'zod';
import type { Article } from '@/domain/Article';

export const ArticleSchema = z.object({
    id_hash: z.string(),
    titulo: z.string(),
    description: z.string(),
    cont: z.string(),
    categories: z.array(z.number()),
    fechaIso: z.string(),
    fecha: z.string(),
    url: z.string(),
    img: z.string().nullable().optional(),
}) satisfies z.ZodType<Article>;

export const NewsSchema = z.array(ArticleSchema);
