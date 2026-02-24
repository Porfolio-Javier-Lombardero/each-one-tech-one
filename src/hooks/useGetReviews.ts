import  { useEffect } from 'react'
import { useStore } from "@/store";

export const useGetReviews = () => {
    const searchReviwes = useStore((state) => state.searchTechReviews)
     const reviews = useStore((state) => state.reviews)
     const loadingReviews = useStore((state) => state.loadingReviews)

     useEffect(() => {

    searchReviwes()
      
     }, [])
     
  return {
   reviews,
   loadingReviews
  }
    
}
