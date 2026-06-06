import { DateFilterType } from '@/domain/Article';
import { TopicId } from '@/domain/Topics';

export const newsKeys = {
    headlines: (topic: TopicId, dateFilter: DateFilterType) =>  ['top-headlines', topic, dateFilter] as const,
    search: (keyword: string) => ['news-search', keyword.toLowerCase().trim()] as const,
};
