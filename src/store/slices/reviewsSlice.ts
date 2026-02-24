import { StateCreator } from "zustand";
import { ReviewsSlice } from "./interfaces/d.slices.types";
import { fetchReviews } from "@/services/reviews/setReviewsFetch";

export const createReviewsSlice: StateCreator<ReviewsSlice, [], [], ReviewsSlice> = (set) => ({
    reviews: undefined,
    loadingReviews: false,
    error: undefined,
    //Actions
    searchTechReviews: async () => {
        set({ loadingReviews: true });

        try {
            // Servicio maneja caché y fetch (patrón estandarizado)
            const reviews = await fetchReviews();

            set({
                reviews,
                loadingReviews: false,
                error: undefined
            });
        } catch (err) {
            set({
                reviews: undefined,
                loadingReviews: false,
                error: err as string
            });
        }
    }
})