import { DateFilterType } from '@/domain/Article';
import { TopicId } from '@/domain/Topics';

export const newsKeys = {
    headlines: (topic: TopicId, dateFilter: DateFilterType) =>  ['top-headlines', topic, dateFilter] as const,
    // keyword is normalized to lowercase + trimmed so that "AI", "ai", and " ai " all hit the same cache entry.
    search: (keyword: string) => ['news-search', keyword.toLowerCase().trim()] as const,
};
