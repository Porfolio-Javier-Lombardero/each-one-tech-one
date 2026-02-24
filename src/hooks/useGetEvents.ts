import { useStore } from "@/store";
import { useEffect } from "react";

export const useGetEvents = () => {
     const searchEvents = useStore((state) => state.searchTechEvents)
      const events = useStore((state) => state.events)
      const loadingEvents = useStore((state) => state.loadingEvents)

        useEffect(() => {
      
          searchEvents()
            
           }, [])
        
  return {
     events,
     loadingEvents
  }
   
}
