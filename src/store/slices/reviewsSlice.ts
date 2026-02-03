import { StateCreator } from "zustand";
import { ReviewsSlice } from "./types/d.slices.types";
import { fetchReviews } from "@/services/api/setReviewsFetch";
import { getReviewsFromCache, saveReviewsToCache } from "@/services/api/reviewsCacheService";


export const createReviewsSlice: StateCreator<ReviewsSlice, [], [], ReviewsSlice> = (set, get) => ({
    reviews: undefined,
    loadingReviews: false,
    error: undefined,
    //Actions
    searchTechReviews: async () => {

        if (get().reviews) {
            console.log('📦 Using cached reviews (Zustand)');
            return;
        }

        set({ loadingReviews: true });

        try {
            // 1. Intentar obtener del caché de Supabase
            const cachedReviews = await getReviewsFromCache(24, 6); // 24 horas, 6 videos

            if (cachedReviews && cachedReviews.length > 0) {
                console.log('✅ Reviews obtenidos del caché de Supabase');
                set({
                    loadingReviews: false,
                    reviews: cachedReviews,
                    error: undefined
                });
                return;
            }

            console.log('📭 No hay caché, consultando YouTube API...');

            // 2. Si no hay caché, consultar YouTube API
            const data = await fetchReviews();

            if (!data || data.length === 0) {
                throw new Error('No se obtuvieron reviews');
            }

            // 3. Guardar en caché para la próxima vez
            await saveReviewsToCache(data);

            set({
                loadingReviews: false,
                reviews: data,
                error: undefined
            });
        } catch (err) {
            set({
                reviews: undefined,
                loadingReviews: false,
                error: err as string
            });
        } finally {
            set({ loadingReviews: false });
        }
    }

})