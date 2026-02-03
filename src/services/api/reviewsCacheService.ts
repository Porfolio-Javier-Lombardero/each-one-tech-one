import { supabase } from './config/supabaseClient';
import { CachedReview, SearchResultItem } from '@/lib/types/d.reviews.types';

/**
 * Convertir review cacheado a formato SearchResultItem
 */
export function convertCachedToSearchResult(cached: CachedReview): SearchResultItem {
    return {
        id: {
            kind: cached.video_kind,
            videoId: cached.video_id,
        },
        snippet: {
            title: cached.title,
            description: cached.description || '',
            thumbnails: {
                high: {
                    url: cached.thumbnail_url || '',
                },
            },
            channelTitle: cached.channel_title || '',
            publishedAt: cached.published_at,
        },
    };
}

/**
 * Obtener reviews del caché
 * @param maxAge - Edad máxima del caché en horas (default: 24 horas)
 * @param limit - Número máximo de reviews a retornar
 */
export async function getReviewsFromCache(
    maxAge: number = 24,
    limit: number = 6
): Promise<SearchResultItem[] | null> {
    try {
        const maxAgeDate = new Date(Date.now() - maxAge * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('reviews_cache')
            .select('*')
            .gte('created_at', maxAgeDate)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error obteniendo reviews del caché:', error);
            return null;
        }

        if (!data || data.length === 0) {
            console.log('📭 No hay reviews en caché');
            return null;
        }

        console.log(`✅ Caché de reviews encontrado: ${data.length} videos`);

        // Convertir al formato que espera la app
        return data.map(convertCachedToSearchResult);
    } catch (error) {
        console.error('Error en getReviewsFromCache:', error);
        return null;
    }
}

/**
 * Guardar múltiples reviews en el caché
 * @param reviews - Array de SearchResultItem de YouTube
 */
export async function saveReviewsToCache(reviews: SearchResultItem[]): Promise<number> {
    try {
        const cacheData = reviews.map(review => ({
            video_id: review.id.videoId,
            title: review.snippet.title,
            description: review.snippet.description || null,
            thumbnail_url: review.snippet.thumbnails.high.url || null,
            channel_title: review.snippet.channelTitle || null,
            published_at: review.snippet.publishedAt,
            source: 'youtube',
            video_kind: review.id.kind,
            updated_at: new Date().toISOString(),
        }));

        const { data, error } = await supabase
            .from('reviews_cache')
            .upsert(cacheData, {
                onConflict: 'video_id',
                ignoreDuplicates: false
            })
            .select();

        if (error) {
            console.error('Error guardando reviews en caché:', error);
            return 0;
        }

        const savedCount = data?.length || 0;
        console.log(`💾 ${savedCount} reviews guardados en caché`);
        return savedCount;
    } catch (error) {
        console.error('Error en saveReviewsToCache:', error);
        return 0;
    }
}

/**
 * Incrementar contador de fetch de un review
 */
export async function incrementReviewFetchCount(videoId: string): Promise<void> {
    try {
        const { data: current } = await supabase
            .from('reviews_cache')
            .select('fetch_count')
            .eq('video_id', videoId)
            .single();

        if (current) {
            await supabase
                .from('reviews_cache')
                .update({
                    fetch_count: current.fetch_count + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('video_id', videoId);
        }
    } catch (error) {
        console.error('Error incrementando fetch_count:', error);
    }
}

/**
 * Limpiar reviews antiguos
 * @param daysOld - Eliminar reviews con más de X días
 */
export async function cleanOldReviews(daysOld: number = 30): Promise<number> {
    try {
        const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('reviews_cache')
            .delete()
            .lt('created_at', cutoffDate)
            .select();

        if (error) {
            console.error('Error limpiando reviews antiguos:', error);
            return 0;
        }

        const deletedCount = data?.length || 0;
        console.log(`🗑️ ${deletedCount} reviews antiguos eliminados`);
        return deletedCount;
    } catch (error) {
        console.error('Error en cleanOldReviews:', error);
        return 0;
    }
}
