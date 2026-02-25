import { DateFilterType, News } from './interfaces/d.news.types';
import { newsFetch } from './setNewsFetch';
import { getNewsFromCache, saveNewsToCache } from './cache/newsCache';
import { NewsCacheRow } from './interfaces/d.news.cache.types';

/**
 * Convierte datos de caché a formato News
 */
function convertCacheToNews(cacheData: NewsCacheRow[]): News {
    return cacheData.map(item => ({
        id: `${item.id}-${item.techcrunch_id}-0000-0000-000000000000` as `${string}-${string}-${string}-${string}-${string}`,
        titulo: item.titulo || '',
        description: item.description || '',
        cont: item.cont || '',
        categories: item.categories || [],
        fechaIso: item.fecha_iso,
        fecha: new Date(item.fecha_iso).toLocaleDateString(),
        url: item.url,
        img: item.img || undefined,
    }));
}

/**
 * Convierte datos de News a formato de caché
 */
function convertNewsToCache(
    newsData: News,
): Omit<NewsCacheRow, 'id' | 'created_at' | 'updated_at' | 'fetch_count'>[] {
    return newsData.map(item => ({
        techcrunch_id: Math.floor(Math.random() * 1000000), // ID temporal
        source: 'techcrunch',
        titulo: item.titulo,
        description: item.description,
        cont: item.cont,
        categories: item.categories,
        fecha_iso: item.fechaIso,
        url: item.url,
        img: item.img || null,
        search_context: null, // Se asignará en saveNewsToCache
    }));
}

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
            // Agregar más mapeos según sea necesario
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
        // Crear identificador único para este contexto
        const searchContext = createSearchContext(topic, dateFilter);

        // 1. Intentar obtener del caché
        const cachedNews = await getNewsFromCache(searchContext);

        if (cachedNews && cachedNews.length > 0) {
            console.log('📦 Usando noticias del caché');
            return convertCacheToNews(cachedNews);
        }

        // 2. Si no hay caché válido, hacer fetch a la API
        console.log('🌐 Obteniendo noticias de la API externa');
        const freshNews = await newsFetch(topic, dateFilter);

        // 3. Guardar en caché si obtuvimos datos
        if (freshNews && freshNews.length > 0) {
            const cacheData = convertNewsToCache(freshNews);
            await saveNewsToCache(cacheData, searchContext);
        }

        return freshNews;
    } catch (error) {
        console.error('❌ Error en fetchNewsWithCache:', error);
        throw error;
    }
}

