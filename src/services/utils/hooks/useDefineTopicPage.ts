import { Topics } from "@/lib/constants/topics";
import { useNewsStore } from "@/stores/useNewsStore";


export const useDefineTopicPage = () => {
  const filtredNews = useNewsStore((state) => state.filteredNews);

  const choseCategory = (topic: string | undefined) => {
    
    switch (topic) {
      case "App's & Software":
        return filtredNews.filter((n) => n.category === Topics.apps);
      case "Smartphones":
        return filtredNews.filter((n) => n.category === Topics.apps);
      case "Gadgets":
        return filtredNews.filter((n) => n.category === Topics.gadgets);
      case "A.I.":
        return filtredNews.filter((n) => n.category === Topics.AI);
      case "Policy & Regulation":
        return filtredNews.filter((n) => n.category === Topics.policy);
      case "Rapshody":
        return filtredNews.filter((n) => n.category === Topics.hardware);
      default:
        break;
    }
  };
  return {
    choseCategory
  };
};
