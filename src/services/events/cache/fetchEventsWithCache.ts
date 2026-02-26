import { Events } from '../interfaces/d.events.types';
import { fetchEvents } from '../setEventsFetch';
import { supabase } from '@/services/api/config/supabaseClient';
import { isCacheFresh } from '@/services/api/config/supaBaseConfig';
import { STALE_TIMES } from '@/services/consts/staletimes.';

/**
 * Parsea strings de eventos en formato "fecha, título, ubicación, url" a EventProps
 */
function parseEventStrings(events: string[]): Events {
    return events.map(str => {
        const [date, title, location, url] = str.split(',').map(s => s?.trim());
        return {
            title: title || '',
            location: location || '',
            date: date || '',
            url: url || ''
        };
    });
}

/**
 * Fetch de eventos con sistema de caché
 */
export async function fetchEventsWithCache(): Promise<Events> {
    try {
        // 1. Verificar caché con updated_at
        const { data: cachedRows, error } = await supabase
            .from('events_cache')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;

        if (cachedRows && cachedRows.length > 0) {
            const mostRecent = cachedRows[0];

            if (isCacheFresh(mostRecent.updated_at, STALE_TIMES.EVENTS)) {
                console.log('📦 Eventos del caché');

                // Proyectar solo EventProps
                return cachedRows.map(({ title, location, date, url }) => ({
                    title, location, date, url
                }));
            }
        }

        // 2. Fetch externo (ya viene mapeado desde fetchEvents)
        console.log('🌐 Obteniendo eventos de Gemini API');
        const mappedStrings = await fetchEvents();
        const parsed = parseEventStrings(mappedStrings);

        // 3. Guardar con metadatos
        if (parsed && parsed.length > 0) {
            const eventsToCache = parsed.map(event => ({
                ...event,
                source: 'gemini',
                fetch_count: 1,
            }));

            // Limpiar caché antiguo
            await supabase.from('events_cache').delete().neq('id', 0);

            await supabase
                .from('events_cache')
                .insert(eventsToCache);

            console.log('✅ Eventos guardados en caché');
        }

        return parsed;
    } catch (error) {
        console.error('❌ Error en fetchEventsWithCache:', error);
        throw error;
    }
}

