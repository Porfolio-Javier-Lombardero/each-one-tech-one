import { ArticleRepository } from '@/domain/ports/ArticleRepository';
import { getTopicId } from '@/domain/Topic';
import { fetchNews } from './queries/fetchNews';

export const supabaseArticleRepository: ArticleRepository = {
    async getHeadlines({ topic, dateFilter, page }) {
        return fetchNews({ topic: getTopicId(topic), dateFilter, page });
    },
};
