import { Event } from '../Event';

export interface EventRepository {
    getAll(): Promise<Event[]>;
}
