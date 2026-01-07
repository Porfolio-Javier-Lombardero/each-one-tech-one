import React from 'react'


import { useQuery } from '@tanstack/react-query';
import { newsFetch } from '@/features/news/hooks/setNewsFetch';

export const useFetch = (topic) => {

    const fetchData = useQuery({
        queryKey: ["TopHeadlines"],
        queryFn: async () => newsFetch(topic),
        staleTime: 1000 * 60 * 24
    })
     
return{
   fetchData
}
}
