import { Topics } from '@/lib/constants/topics';
import { DateFilterType } from '@/lib/types/d.news.types';
import { useNewsStore } from '@/stores/useNewsStore';

export const useCategoryFilter = () => {
  const searchByCategory = useNewsStore(state => state.searchByCategory)

  const getTopicId = (topic: string | undefined): number | undefined => {
    switch (topic) {
      case "App's & Software":
        return Topics.apps;
      case "Smartphones":
        return Topics.apps;
      case "Gadgets":
        return Topics.gadgets;
      case "A.I.":
        return Topics.AI;
      case "Policy & Regulation":
        return Topics.policy;
      case "Hardware":
        return Topics.hardware;
      default:
        return undefined;
    }
  };

  const setCategory = (
    topic: string | undefined,
    dateFilter: DateFilterType = 'today'
  ) => {
    const topicId = getTopicId(topic);
    if (topicId !== undefined) {
      searchByCategory(topicId, dateFilter);
    }
  };

  return {
    setCategory,
    getTopicId
  };
};
