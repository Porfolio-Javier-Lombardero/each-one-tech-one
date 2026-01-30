import { StateCreator } from "zustand";
import { ReviewsSlice } from "./types/d.slices.types";
import { fetchReviews } from "@/services/api/setReviewsFetch";


export const createReviewsSlice: StateCreator<ReviewsSlice, [], [], ReviewsSlice> = (set, get) => ({
    reviews: undefined,
    loadingReviews: false,
    error: undefined,
    //Actions
    searchTechReviews: async () => {

        if (get().reviews) {
            console.log('📦 Using cached reviews');
            return;
        }

        set({ loadingReviews: true });
        try {
            const data = await fetchReviews();
            set({ loadingReviews: false, 
                reviews: data ? data : undefined });
        } catch (err) {
            set({ reviews: undefined, 
                loadingReviews: false, 
                error: err as string });
        } finally {
            set({ loadingReviews: false });
        }
    }

})