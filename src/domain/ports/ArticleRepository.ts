import { Article, DateFilterType } from '../Article';
import { TopicId } from '../Topics';

// Output port that defines how the app fetches articles. Implementations (e.g. SupabaseArticleRepository) handle the translation from domain types to API-specific values.
export interface ArticleRepository {
    getHeadlines(params: {
        topic: TopicId;
        dateFilter: DateFilterType;
        page: number; // 1-indexed. The edge function returns at most 10 items per page.
    }): Promise<Article[]>;

    // Searches across the full article index with no date filter. Keyword search spans historical data, unlike getHeadlines which is always scoped to a time window.
    searchByKeyword(params: {
        keyword: string;
        page: number; // 1-indexed.
    }): Promise<Article[]>;
}
