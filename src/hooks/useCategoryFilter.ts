import { Topics } from '@/lib/constants/topics';
import { DateFilterType } from '@/lib/types/d.news.types';
import { useNewsStore } from '@/stores/useNewsStore';

export const useCategoryFilter = () => {
  const searchByCategory = useNewsStore(state => state.searchByCategory)

  const getTopicId = (topic: string | undefined): number | string | undefined => {
    switch (topic) {
      case "App's & Software":
        return Topics.apps;
      case "Smartphones":
        return "smartphone iPhone Android mobile Samsung Pixel foldable"
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

  const setCategory = (topic: string, dateFilter: DateFilterType = 'today') => {
    const topicId: number | string | undefined = getTopicId(topic);
    if (topicId !== undefined) {
      searchByCategory(topicId, dateFilter);
    }
  };


  return {
    setCategory,
    getTopicId,

  };
};
