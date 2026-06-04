import { ReviewRepository } from '@/domain/ports/ReviewRepository';
import { fetchReviews } from './queries/fetchReviews';

export const supabaseReviewRepository: ReviewRepository = {
    async getAll() {
        return fetchReviews();
    },
};
