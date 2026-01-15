import { Topics } from '@/lib/constants/topics';
import { useNewsStore } from '@/stores/useNewsStore';
import React, { useState } from 'react'

export const useCategoryFilter = () => {
   

    const searchByCategory = useNewsStore(state=> state.searchByCategory)
   
    const  setCategory = (topic: string | undefined)=>{
     
            switch (topic) {
        case "App's & Software":
              searchByCategory(Topics.apps)
            break;
        case "Smartphones":
              searchByCategory(Topics.apps)
            break;
        case "Gadgets":
              searchByCategory(Topics.gadgets)
            break;
        case "A.I.":
              searchByCategory(Topics.AI)
            break;
        case "Policy & Regulation":
              searchByCategory(Topics.policy)
            break;
        case "Rapshody":
              searchByCategory(Topics.hardware)
            break;
    
        default:
            break;
    }
    }
 return {
    setCategory
 }

}
