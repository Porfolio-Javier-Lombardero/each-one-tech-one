import React from 'react'

import { newsFetch } from '../Services/setNewsFetch';
import { useQuery } from '@tanstack/react-query';

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
