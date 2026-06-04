import { z } from 'zod';
import type { Event } from '@/domain/Event';

export const EventSchema = z.object({
    title: z.string(),
    location: z.string(),
    date: z.string(),
    url: z.string(),
}) satisfies z.ZodType<Event>;

export const EventsSchema = z.array(EventSchema);
