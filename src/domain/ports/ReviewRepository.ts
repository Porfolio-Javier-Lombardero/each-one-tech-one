import { Review } from '../Review';

export interface ReviewRepository {
    getAll(): Promise<Review[]>;
}
