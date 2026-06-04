import { ReviewRepository } from '@/domain/ports/ReviewRepository';
import { REVIEWS_FIXTURE } from './fixtures/reviews.fixture';

export const mockReviewRepository: ReviewRepository = {
    async getAll() {
        return REVIEWS_FIXTURE;
    },
};
