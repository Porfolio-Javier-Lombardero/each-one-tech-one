import { fetchEvents } from './setEventsFetch';
import { getEventsFromCache, saveEventsToCache } from './cache/eventsCache';
import { EventsCacheRow } from './interfaces/d.events.cache';

/**
 * Convierte datos de caché a formato string[] (formato: "fecha, título, ubicación, url")
 */
function convertCacheToEvents(cacheData: EventsCacheRow[]): string[] {
    return cacheData.map(item =>
        `${item.event_date}, ${item.event_name}, ${item.event_city}, ${item.event_url}`
    );
}

/**
 * Convierte datos de string[] a formato de caché
 * @param eventsData - Array de strings en formato "fecha, título, ubicación, url"
 */
function convertEventsToCache(
    eventsData: string[],
    source: string = 'gemini'
): Omit<EventsCacheRow, 'id' | 'created_at' | 'updated_at' | 'fetch_count'>[] {
    return eventsData.map(eventString => {
        const parts = eventString.split(',').map(s => s.trim());
        return {
            event_date: parts[0] || '',
            event_name: parts[1] || '',
            event_city: parts[2] || '',
            event_url: parts[3] || '',
            source: source,
            raw_text: eventString,
        };
    });
}

/**
 * Fetch de eventos con sistema de caché
 */
export async function fetchEventsWithCache(): Promise<string[]> {
    try {
        // 1. Intentar obtener del caché
        const cachedEvents = await getEventsFromCache();

        if (cachedEvents && cachedEvents.length > 0) {
            console.log('📦 Usando eventos del caché');
            return convertCacheToEvents(cachedEvents);
        }

        // 2. Si no hay caché válido, hacer fetch a la API
        console.log('🌐 Obteniendo eventos de Gemini API');
        const freshEvents = await fetchEvents();

        // 3. Guardar en caché si obtuvimos datos
        if (freshEvents && freshEvents.length > 0) {
            const cacheData = convertEventsToCache(freshEvents);
            await saveEventsToCache(cacheData);
        }

        return freshEvents;
    } catch (error) {
        console.error('❌ Error en fetchEventsWithCache:', error);
        throw error;
    }
}

