import { supabase } from "@/services/api/config/supabaseClient";
import { NewsCacheRow } from "../interfaces/d.news.cache.types";
import { isCacheFresh } from "@/services/api/config/supaBaseConfig";
import { STALE_TIMES } from "@/services/consts/staletimes.";


/**
 * Obtiene noticias del caché si están frescas
 * @param searchContext - Contexto de búsqueda (topic + dateFilter)
 * @returns Noticias cacheadas o null si no hay o están obsoletas
 */
export async function getNewsFromCache(
  searchContext: string
): Promise<NewsCacheRow[] | null> {
  try {
    const { data, error } = await supabase
      .from('news_cache')
      .select('*')
      .eq('search_context', searchContext)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Verificar si el caché más reciente está fresco
    const mostRecent = data[0];
    if (!isCacheFresh(mostRecent.updated_at, STALE_TIMES.NEWS)) {
      console.log('⏰ Caché expirado para', searchContext);
      return null;
    }

    console.log('✅ Noticias obtenidas del caché:', searchContext);
    return data;
  } catch (error) {
    console.error('❌ Error obteniendo noticias del caché:', error);
    return null;
  }
}

/**
 * Guarda noticias en el caché
 * @param news - Array de noticias a cachear
 * @param searchContext - Contexto de búsqueda para este conjunto de noticias
 */
export async function saveNewsToCache(
  news: Omit<NewsCacheRow, 'id' | 'created_at' | 'updated_at' | 'fetch_count'>[],
  searchContext: string
): Promise<void> {
  try {
    // Limpiar caché antiguo SOLO para este search_context específico
    await supabase.from('news_cache').delete().eq('search_context', searchContext);

    const newsToInsert = news.map(item => ({
      ...item,
      search_context: searchContext,
      fetch_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Usar upsert con constraint compuesto (url, search_context)
    const { error } = await supabase
      .from('news_cache')
      .upsert(newsToInsert, {
        onConflict: 'url,search_context',
        ignoreDuplicates: false
      });

    if (error) throw error;
    console.log('✅ Noticias guardadas en caché:', searchContext);
  } catch (error) {
    console.error('❌ Error guardando noticias en caché:', error);
    // No lanzar el error para que la aplicación continúe funcionando
  }
}

/**
 * Incrementa el contador de fetch para una noticia
 * @param id - ID de la noticia
 */
export async function incrementNewsFetchCount(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_fetch_count', {
      table_name: 'news_cache',
      row_id: id
    });

    if (error) throw error;
  } catch (error) {
    console.error('❌ Error incrementando fetch count:', error);
  }
}