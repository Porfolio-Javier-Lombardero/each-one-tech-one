import { ArticleRepository } from '@/domain/ports/ArticleRepository';
import { getTopicId } from '@/domain/Topics';
import { fetchNews } from './queries/fetchNews';
import { searchNews } from './queries/searchNews';

// Adapter that implements ArticleRepository using Supabase Edge Functions. getTopicId() is called here — not in the hook — because translating domain values to API-specific identifiers is the adapter's responsibility, not the caller's.
export const supabaseArticleRepository: ArticleRepository = {
    async getHeadlines({ topic, dateFilter, page }) {
        return fetchNews({ topic: getTopicId(topic), dateFilter, page });
    },

    async searchByKeyword({ keyword, page }) {
        return searchNews({ keyword, page });
    },
};
