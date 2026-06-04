import { EventRepository } from '@/domain/ports/EventRepository';
import { EVENTS_FIXTURE } from './fixtures/events.fixture';

export const mockEventRepository: EventRepository = {
    async getAll() {
        return EVENTS_FIXTURE;
    },
};
