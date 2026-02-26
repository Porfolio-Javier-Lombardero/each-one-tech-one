import { DateFilterType, News, NewsCacheRow } from '../interfaces/d.news.types';
import { newsFetch } from '../setNewsFetch';
import { supabase } from '@/services/api/config/supabaseClient';
import { isCacheFresh } from '@/services/api/config/supaBaseConfig';
import { STALE_TIMES } from '@/services/consts/staletimes.';

/**
 * Crea un identificador único para el contexto de búsqueda
 */
function createSearchContext(topic: number | string, dateFilter: DateFilterType): string {
    let topicStr: string;

    if (typeof topic === 'number') {
        topicStr = `cat_${topic}`;
    } else {
        // Normalizar strings largos a identificadores cortos
        const topicMap: Record<string, string> = {
            "smartphone iPhone Android mobile Samsung Pixel foldable": "smartphones",
            "AI": "ai",
            "A.I.": "ai",
        };

        topicStr = topicMap[topic] || topic.toLowerCase().replace(/\s+/g, '_').substring(0, 20);
    }

    return `${topicStr}_${dateFilter}`;
}

/**
 * Fetch de noticias con sistema de caché
 */
export async function fetchNewsWithCache(
    topic: number | string,
    dateFilter: DateFilterType
): Promise<News | void> {
    try {
        const searchContext = createSearchContext(topic, dateFilter);

        // 1. Query con campos de caché para validación
        const { data: cachedRows, error } = await supabase
            .from('news_cache')
            .select('*')
            .eq('search_context', searchContext)
            .order('updated_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        // 2. Validar frescura con campos de caché
        if (cachedRows && cachedRows.length > 0) {
            const mostRecent = cachedRows[0];

            if (isCacheFresh(mostRecent.updated_at, STALE_TIMES.NEWS)) {
                console.log('📦 Cache válido:', searchContext);

                // Proyectar solo campos de SingleNew
                return cachedRows.map(({
                    id_hash, titulo, description, cont,
                    categories, fechaIso, fecha, url, img
                }) => ({
                    id_hash, titulo, description, cont,
                    categories, fechaIso, fecha, url, img
                })) as News;
            }
        }

        // 3. Fetch API externa (ya viene mapeado desde newsFetch)
        console.log('🌐 Fetching desde API:', searchContext);
        const mappedNews = await newsFetch(topic, dateFilter);

        // 4. Guardar con campos de caché
        if (mappedNews && mappedNews.length > 0) {
            const newsToCache: Partial<NewsCacheRow>[] = mappedNews.map(item => ({
                ...item,
                search_context: searchContext,
                source: 'techcrunch',
                fetch_count: 1,
            }));

            // Limpiar caché antiguo del mismo contexto
            await supabase
                .from('news_cache')
                .delete()
                .eq('search_context', searchContext);

            await supabase
                .from('news_cache')
                .insert(newsToCache);

            console.log('✅ Noticias guardadas en caché:', searchContext);
        }

        return mappedNews;
    } catch (error) {
        console.error('❌ Error en fetchNewsWithCache:', error);
        throw error;
    }
}

