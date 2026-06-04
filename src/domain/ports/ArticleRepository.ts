import { Article, DateFilterType } from '../Article';
import { TopicId } from '../Topics';

export interface ArticleRepository {
    getHeadlines(params: {
        topic: TopicId;
        dateFilter: DateFilterType;
        page: number;
    }): Promise<Article[]>;
}
