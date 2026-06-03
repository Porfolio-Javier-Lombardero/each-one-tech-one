import { Subscriber } from '../Subscriber';

export interface SubscriberRepository {
    create(subscriber: Subscriber): Promise<void>;
}
