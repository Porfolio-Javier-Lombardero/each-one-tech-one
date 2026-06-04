import { EventRepository } from '@/domain/ports/EventRepository';
import { fetchEvents } from './queries/fetchEvents';

export const supabaseEventRepository: EventRepository = {
    async getAll() {
        return fetchEvents();
    },
};
