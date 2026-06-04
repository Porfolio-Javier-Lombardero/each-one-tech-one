import { z } from 'zod';
import type { Review } from '@/domain/Review';

export const ReviewSchema = z.object({
    video_id: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnail_url: z.string(),
    channel_title: z.string(),
    published_at: z.string(),
    video_kind: z.string(),
}) satisfies z.ZodType<Review>;

export const ReviewsSchema = z.array(ReviewSchema);
