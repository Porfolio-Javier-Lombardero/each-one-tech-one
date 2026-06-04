import { ArticleRepository } from '@/domain/ports/ArticleRepository';
import { ARTICLES_FIXTURE } from './fixtures/articles.fixture';

export const mockArticleRepository: ArticleRepository = {
    async getHeadlines() {
        return ARTICLES_FIXTURE;
    },
};
