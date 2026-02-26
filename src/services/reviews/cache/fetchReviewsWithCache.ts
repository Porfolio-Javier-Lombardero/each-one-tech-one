import { fetchReviews } from '../setReviewsFetch';
import { Reviews } from '../interfaces/d.reviews.types';
import { supabase } from '@/services/api/config/supabaseClient';
import { isCacheFresh } from '@/services/api/config/supaBaseConfig';
import { STALE_TIMES } from '@/services/consts/staletimes.';

/**
 * Fetch de reviews con sistema de caché
 */
export async function fetchReviewsWithCache(): Promise<Reviews> {
    try {
        // 1. Verificar caché con proyección selectiva
        const { data: cachedRows, error } = await supabase
            .from('reviews_cache')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;

        if (cachedRows && cachedRows.length > 0) {
            const mostRecent = cachedRows[0];

            if (isCacheFresh(mostRecent.updated_at, STALE_TIMES.REVIEWS)) {
                console.log('📦 Reviews del caché');

                // ✨ Proyectar solo campos de Review (sin metadatos de caché)
                return cachedRows.map(({
                    video_id, title, description,
                    thumbnail_url, channel_title,
                    published_at, video_kind
                }) => ({
                    video_id, title, description,
                    thumbnail_url, channel_title,
                    published_at, video_kind
                })) as Reviews;
            }
        }

        // 2. Fetch externo (ya viene en formato plano Review[])
        console.log('🌐 Obteniendo reviews de YouTube API');
        const freshReviews = await fetchReviews();

        // 3. Guardar directamente (solo agregar metadatos de caché)
        if (freshReviews && freshReviews.length > 0) {
            const reviewsToCache = freshReviews.map(review => ({
                ...review, // ✨ Ya está en el formato correcto
                source: 'youtube',
                fetch_count: 1,
            }));

            // Limpiar caché antiguo
            await supabase.from('reviews_cache').delete().neq('id', 0);

            await supabase
                .from('reviews_cache')
                .insert(reviewsToCache);

            console.log('✅ Reviews guardadas en caché');
        }

        return freshReviews;
    } catch (error) {
        console.error('❌ Error en fetchReviewsWithCache:', error);
        throw error;
    }
}
