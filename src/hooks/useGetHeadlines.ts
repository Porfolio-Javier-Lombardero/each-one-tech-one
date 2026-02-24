import { useEffect } from "react";
import { useStore } from "@/store";

export const useGetHeadlines = () => {
    const searchHeadLines = useStore((state) => state.searchTopHeadLines);
   
    const news = useStore((state) => state.news);
    const loadingNews = useStore((state) => state.loadingNews);
   
   useEffect(() => {
        if (!news) {
            searchHeadLines(0, undefined)}
            
    }, []);

    return { news, loadingNews};
};


