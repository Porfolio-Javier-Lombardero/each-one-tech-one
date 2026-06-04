import { Topics } from '@/domain/Topics';

export const getTopicName = (topicId: number | undefined): string => {
    if (topicId === undefined) return 'smartphones';
    return (
        Object.keys(Topics).find(
            (key) => Topics[key as keyof typeof Topics] === topicId,
        ) ?? 'smartphones'
    );
};
