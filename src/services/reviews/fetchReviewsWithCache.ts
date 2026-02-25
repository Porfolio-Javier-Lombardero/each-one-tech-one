import { fetchReviews } from './setReviewsFetch';
import { getReviewsFromCache, saveReviewsToCache } from './cache/reviewsCache';
import { ReviewsCacheRow } from './interfaces/d.reviews.cache.types';
import { SearchResultItem } from './interfaces/d.reviews.types';

/**
 * Convierte datos de caché a formato SearchResultItem
 */
function convertCacheToReviews(cacheData: ReviewsCacheRow[]): SearchResultItem[] {
    return cacheData.map(item => ({
        id: {
            kind: 'youtube#video',
            videoId: item.video_id,
        },
        snippet: {
            title: item.title,
            description: item.description || '',
            thumbnails: {
                high: { url: item.thumbnail_url || '' },
            },
            channelTitle: item.channel_title || '',
            publishedAt: item.published_at,
        },
    }));
}

/**
 * Convierte datos de SearchResultItem a formato de caché
 */
function convertReviewsToCache(
    reviewsData: SearchResultItem[]
): Omit<ReviewsCacheRow, 'id' | 'created_at' | 'updated_at' | 'fetch_count'>[] {
    return reviewsData.map(item => ({
        video_id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description || null,
        thumbnail_url: item.snippet.thumbnails.high.url || null,
        channel_title: item.snippet.channelTitle || null,
        published_at: item.snippet.publishedAt,
        source: 'youtube',
        video_kind: item.id.kind,
    }));
}

/**
 * Fetch de reviews con sistema de caché
 */
export async function fetchReviewsWithCache(): Promise<SearchResultItem[]> {
    try {
        // 1. Intentar obtener del caché
        const cachedReviews = await getReviewsFromCache();

        if (cachedReviews && cachedReviews.length > 0) {
            console.log('📦 Usando reviews del caché');
            return convertCacheToReviews(cachedReviews);
        }

        // 2. Si no hay caché válido, hacer fetch a la API
        console.log('🌐 Obteniendo reviews de YouTube API');
        const freshReviews = await fetchReviews();

        // 3. Guardar en caché si obtuvimos datos
        if (freshReviews && freshReviews.length > 0) {
            const cacheData = convertReviewsToCache(freshReviews);
            await saveReviewsToCache(cacheData);
        }

        return freshReviews;
    } catch (error) {
        console.error('❌ Error en fetchReviewsWithCache:', error);
        throw error;
    }
}
