import { Topics } from '@/services/news/interfaces/topics';
import { DateFilterType } from '@/services/news/interfaces/d.news.types';
import { useStore } from '@/store';

export const useCategoryFilter = () => {
  const searchByCategory = useStore(state => state.searchByCategory)

  const getTopicId = (topic: string | undefined): number | string | undefined => {
    switch (topic) {
      case "App's & Software":
        return Topics.App;
      case "Smartphones":
        return "smartphone iPhone Android mobile Samsung Pixel foldable"
      case "Hardware & Gadgets":
        return Topics.Gadgets;
      case "A.I.":
        return Topics.AI;
      case "Policy & Regulation":
        return Topics.Policy;
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
