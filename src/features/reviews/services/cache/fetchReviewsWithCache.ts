import { Reviews } from '@/domain/Review';
import { supabase } from '@/shared/lib/config/supabaseClient';

/**
 * Fetch de reviews vía Edge Function con caché en Supabase
 * La lógica de caché y fetch a YouTube API está en la Edge Function
 */
export async function fetchReviewsWithCache(): Promise<Reviews> {
    try {
        // Invocar Edge Function get-reviews (maneja caché + YouTube API)
        const { data, error } = await supabase.functions.invoke('get-reviews');

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('❌ Error en fetchReviewsWithCache:', error);
        throw error;
    }
}
