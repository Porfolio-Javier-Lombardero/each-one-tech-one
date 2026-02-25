import { supabase } from '@/services/api/config/supabaseClient';
import { isCacheFresh } from '@/services/api/config/supaBaseConfig';
import { STALE_TIMES } from '@/services/consts/staletimes.';
import { EventsCacheRow } from '../interfaces/d.events.cache';

/**
 * Obtiene eventos del caché si están frescos
 * @param source - Fuente de los eventos (opcional)
 * @returns Eventos cacheados o null si no hay o están obsoletos
 */
export async function getEventsFromCache(
  source?: string
): Promise<EventsCacheRow[] | null> {
  try {
    let query = supabase
      .from('events_cache')
      .select('*')
      .order('event_date', { ascending: true });

    // Filtrar por fuente si se proporciona
    if (source) {
      query = query.eq('source', source);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Verificar si el caché más reciente está fresco
    const mostRecent = data[0];
    if (!isCacheFresh(mostRecent.updated_at, STALE_TIMES.EVENTS)) {
      return null;
    }

    console.log('✅ Eventos obtenidos del caché');
    return data;
  } catch (error) {
    console.error('❌ Error obteniendo eventos del caché:', error);
    return null;
  }
}

/**
 * Guarda eventos en el caché
 * @param events - Array de eventos a cachear
 */
export async function saveEventsToCache(
  events: Omit<EventsCacheRow, 'id' | 'created_at' | 'updated_at' | 'fetch_count'>[]
): Promise<void> {
  try {
    // Limpiar caché antiguo
    await supabase.from('events_cache').delete().gt('id', 0);

    const eventsToInsert = events.map(item => ({
      ...item,
      fetch_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('events_cache')
      .insert(eventsToInsert);

    if (error) throw error;
    console.log('✅ Eventos guardados en caché');
  } catch (error) {
    console.error('❌ Error guardando eventos en caché:', error);
    // No lanzar el error para que la aplicación continúe funcionando
  }
}

/**
 * Incrementa el contador de fetch para un evento
 * @param id - ID del evento
 */
export async function incrementEventsFetchCount(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_fetch_count', {
      table_name: 'events_cache',
      row_id: id
    });

    if (error) throw error;
  } catch (error) {
    console.error('❌ Error incrementando fetch count:', error);
  }
}