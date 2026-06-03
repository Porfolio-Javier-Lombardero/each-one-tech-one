import { Article, DateFilterType } from '../Article';
import { TopicId } from '../Topic';

export interface ArticleRepository {
    getHeadlines(params: {
        topic: TopicId;
        dateFilter: DateFilterType;
        page: number;
    }): Promise<Article[]>;
}
