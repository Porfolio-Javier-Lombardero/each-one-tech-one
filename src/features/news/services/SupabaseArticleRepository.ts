import { ArticleRepository } from '@/domain/ports/ArticleRepository';
import { getTopicId } from '@/domain/Topics';
import { fetchNews } from './queries/fetchNews';
import { searchNews } from './queries/searchNews';

export const supabaseArticleRepository: ArticleRepository = {
    async getHeadlines({ topic, dateFilter, page }) {
        return fetchNews({ topic: getTopicId(topic), dateFilter, page });
    },

    async searchByKeyword({ keyword, page }) {
        return searchNews({ keyword, page });
    },
};
