import { Topics } from '@/services/news/interfaces/topics';

export const getTopicId = (topic: string | number ): number | string => {
    switch (topic) {
      case "App's & Software":
        return Topics.app;
      case "Smartphones":
        return "smartphone"
      case "Hardware & Gadgets":
        return Topics.gadgets;
      case "A.I.":
        return Topics.AI;
      case "Policy & Regulation":
        return Topics.policy;
      default:
        return 0;
    }
  };





