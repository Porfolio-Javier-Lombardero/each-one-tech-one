import { Topics } from '@/services/news/interfaces/topics';

export const getTopicId = (topic: string | number ): number | string => {
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
        return 0;
    }
  };





