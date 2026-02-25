import { supabase } from '@/services/api/config/supabaseClient';
import { isCacheFresh } from '@/services/api/config/supaBaseConfig';
import { STALE_TIMES } from '@/services/consts/staletimes.';
import { ReviewsCacheRow } from '../interfaces/d.reviews.cache.types';

/**
 * Obtiene reviews del caché si están frescas
 * @returns Reviews cacheadas o null si no hay o están obsoletas
 */
export async function getReviewsFromCache(): Promise<ReviewsCacheRow[] | null> {
  try {
    const { data, error } = await supabase
      .from('reviews_cache')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Verificar si el caché más reciente está fresco
    const mostRecent = data[0];
    if (!isCacheFresh(mostRecent.updated_at, STALE_TIMES.REVIEWS)) {
      return null;
    }

    console.log('✅ Reviews obtenidas del caché');
    return data;
  } catch (error) {
    console.error('❌ Error obteniendo reviews del caché:', error);
    return null;
  }
}

/**
 * Guarda reviews en el caché
 * @param reviews - Array de reviews a cachear
 */
export async function saveReviewsToCache(
  reviews: Omit<ReviewsCacheRow, 'id' | 'created_at' | 'updated_at' | 'fetch_count'>[]
): Promise<void> {
  try {
    // Limpiar caché antiguo
    await supabase.from('reviews_cache').delete().gt('id', 0);

    const reviewsToInsert = reviews.map(item => ({
      ...item,
      fetch_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('reviews_cache')
      .insert(reviewsToInsert);

    if (error) throw error;
    console.log('✅ Reviews guardadas en caché');
  } catch (error) {
    console.error('❌ Error guardando reviews en caché:', error);
    // No lanzar el error para que la aplicación continúe funcionando
  }
}

/**
 * Incrementa el contador de fetch para una review
 * @param id - ID de la review
 */
export async function incrementReviewsFetchCount(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_fetch_count', {
      table_name: 'reviews_cache',
      row_id: id
    });

    if (error) throw error;
  } catch (error) {
    console.error('❌ Error incrementando fetch count:', error);
  }
}