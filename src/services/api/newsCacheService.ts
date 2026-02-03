import { supabase } from './config/supabaseClient';
import { CachedNews, SingleNew } from '@/lib/types/d.news.types';
import { formatDate } from '@/utils/formatDates';

/**
 * Convierte un artículo de caché de Supabase al formato SingleNew usado en la app
 * Ahora es mucho más simple porque los nombres coinciden
 */
export function convertCachedToSingleNew(cached: CachedNews): SingleNew {
    return {
        id: crypto.randomUUID(),
        titulo: cached.titulo,
        description: cached.description || '',
        cont: cached.cont || '',
        categories: cached.categories || [],
        fechaIso: cached.fecha_iso,
        fecha: formatDate(cached.fecha_iso), // Solo formateamos la fecha para display
        url: cached.url,
        img: cached.img,
    };
}

/**
 * Buscar noticias en el caché de Supabase con estrategia de caché amplio
 * @param source - Fuente de la noticia: 'techcrunch' o 'theguardian'
 * @param searchContext - Contexto de búsqueda: 'homepage', 'category_449', etc.
 * @param maxAge - Edad máxima del caché en horas (default: 168 horas = 7 días)
 * @returns Array de noticias o null si no hay caché válido
 */
export async function getNewsFromCache(
    source: string,
    searchContext: string,
    maxAge: number = 168 // 7 días por defecto
): Promise<SingleNew[] | null> {
    try {
        const maxAgeDate = new Date(Date.now() - maxAge * 60 * 60 * 1000).toISOString();

        let query = supabase
            .from('news_cache')
            .select('*')
            .eq('source', source)
            .eq('search_context', searchContext) // Buscar por contexto específico
            .gte('created_at', maxAgeDate)
            .order('fecha_iso', { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error('Error obteniendo caché:', error);
            return null;
        }

        if (!data || data.length === 0) {
            console.log(`📭 No hay caché válido para ${source}`);
            return null;
        }

        console.log(`✅ Caché encontrado: ${data.length} artículos de ${source}`);

        // Convertir al formato de la app
        return data.map(convertCachedToSingleNew);
    } catch (error) {
        console.error('Error en getNewsFromCache:', error);
        return null;
    }
}

/**
 * Guardar noticias en el caché de Supabase
 * Ahora más simple: los nombres coinciden entre SingleNew y la DB
 */
export async function saveNewsToCache(
    source: string,
    techcrunchId: number,
    article: SingleNew,
    searchContext: string = 'mixed'
): Promise<boolean> {
    try {
        const { error } = await supabase.from('news_cache').upsert(
            {
                source,
                techcrunch_id: techcrunchId,
                titulo: article.titulo,
                description: article.description, // ✅ Ya coincide
                cont: article.cont,
                categories: article.categories,
                fecha_iso: article.fechaIso,
                url: article.url,
                img: article.img,
                search_context: searchContext, // Agregar contexto de búsqueda
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: 'techcrunch_id',
            }
        );

        if (error) {
            console.error('Error guardando en caché:', error);
            return false;
        }

        console.log(`💾 Artículo guardado en caché: ${article.titulo.substring(0, 50)}...`);
        return true;
    } catch (error) {
        console.error('Error en saveNewsToCache:', error);
        return false;
    }
}

/**
 * Guardar múltiples noticias en el caché con search_context
 * Simplificado: ya no necesita mapeo de nombres
 */
export async function saveMultipleNewsToCache(
    source: string,
    articles: Array<{ id: number; article: SingleNew }>,
    searchContext: string = 'mixed'
): Promise<number> {
    try {
        const cacheData = articles.map(({ id, article }) => ({
            source,
            techcrunch_id: id,
            titulo: article.titulo,
            description: article.description, // ✅ Ya coincide
            cont: article.cont,
            categories: article.categories,
            fecha_iso: article.fechaIso,
            url: article.url,
            img: article.img,
            search_context: searchContext, // Agregar contexto de búsqueda
            updated_at: new Date().toISOString(),
        }));

        const { data, error } = await supabase
            .from('news_cache')
            .upsert(cacheData, { onConflict: 'techcrunch_id' })
            .select();

        if (error) {
            console.error('Error guardando múltiples artículos:', error);
            return 0;
        }

        const savedCount = data?.length || 0;
        console.log(`💾 ${savedCount} artículos guardados en caché de ${source}`);
        return savedCount;
    } catch (error) {
        console.error('Error en saveMultipleNewsToCache:', error);
        return 0;
    }
}

/**
 * Incrementar el contador de fetch de un artículo
 */
export async function incrementFetchCount(techcrunchId: number): Promise<void> {
    try {
        const { error } = await supabase.rpc('increment_fetch_count', {
            article_id: techcrunchId,
        });

        if (error) {
            console.error('Error incrementando fetch_count:', error);
        }
    } catch (error) {
        console.error('Error en incrementFetchCount:', error);
    }
}
