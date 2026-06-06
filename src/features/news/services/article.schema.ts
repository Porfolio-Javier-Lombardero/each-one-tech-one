import { z } from 'zod';
import type { Article } from '@/domain/Article';

// Zod schema that validates raw API data against the Article domain type. Uses satisfies z.ZodType<Article> so TypeScript catches any drift between the schema and the domain interface at compile time.
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
