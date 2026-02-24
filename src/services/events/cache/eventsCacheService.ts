import { CachedEvent } from '@/services/events/interfaces/d.events.types.ts';
import { supabase } from '../api/config/supabaseClient.ts'

/**
 * Parsear un evento del formato string al objeto separado
 * Formato: "January 6-9 2026, CES, Las Vegas, https://ces.tech"
 */
function parseEventString(eventString: string): {
    event_date: string;
    event_name: string;
    event_city: string;
    event_url: string;
} | null {
    try {
        const parts = eventString.split(',').map(p => p.trim());

        if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) {
            console.error('Formato de evento inválido:', eventString);
            return null;
        }

        return {
            event_date: parts[0],       // "January 6-9 2026"
            event_name: parts[1],       // "CES"
            event_city: parts[2],       // "Las Vegas"
            event_url: parts[3] || '',  // "https://ces.tech" (opcional)
        };
    } catch (error) {
        console.error('Error parseando evento:', error);
        return null;
    }
}

/**
 * Obtener eventos del caché
 * @param maxAge - Edad máxima del caché en días (default: 30 días)
 */
export async function getEventsFromCache(maxAge: number = 30): Promise<string[] | null> {
    try {
        const maxAgeDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('events_cache')
            .select('*')
            .gte('created_at', maxAgeDate)
            .order('event_date', { ascending: true });

        if (error) {
            console.error('Error obteniendo eventos del caché:', error);
            return null;
        }

        if (!data || data.length === 0) {
            console.log('📭 No hay eventos en caché');
            return null;
        }

        console.log(`✅ Caché de eventos encontrado: ${data.length} eventos`);

        // Retornar en formato string (como tu app lo espera)
        return data.map((event: CachedEvent) => event.raw_text);
    } catch (error) {
        console.error('Error en getEventsFromCache:', error);
        return null;
    }
}

/**
 * Guardar múltiples eventos en el caché
 * @param events - Array de strings con eventos
 */
export async function saveEventsToCache(events: string[]): Promise<number> {
    try {
        // Parsear cada evento
        const parsedEvents = events
            .map(eventString => {
                const parsed = parseEventString(eventString);
                if (!parsed) return null;

                return {
                    event_date: parsed.event_date,
                    event_name: parsed.event_name,
                    event_city: parsed.event_city,
                    event_url: parsed.event_url || null,
                    source: 'gemini',
                    raw_text: eventString,
                    updated_at: new Date().toISOString(),
                };
            })
            .filter(event => event !== null);

        if (parsedEvents.length === 0) {
            console.error('No se pudo parsear ningún evento');
            return 0;
        }

        const { data, error } = await supabase
            .from('events_cache')
            .upsert(parsedEvents, {
                onConflict: 'event_name,event_date',
                ignoreDuplicates: false
            })
            .select();

        if (error) {
            console.error('Error guardando eventos en caché:', error);
            return 0;
        }

        const savedCount = data?.length || 0;
        console.log(`💾 ${savedCount} eventos guardados en caché`);
        return savedCount;
    } catch (error) {
        console.error('Error en saveEventsToCache:', error);
        return 0;
    }
}

/**
 * Limpiar eventos antiguos (opcio nal)
 * @param daysOld - Eliminar eventos con más de X días
 */
export async function cleanOldEvents(daysOld: number = 90): Promise<number> {
    try {
        const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('events_cache')
            .delete()
            .lt('created_at', cutoffDate)
            .select();

        if (error) {
            console.error('Error limpiando eventos antiguos:', error);
            return 0;
        }

        const deletedCount = data?.length || 0;
        console.log(`🗑️ ${deletedCount} eventos antiguos eliminados`);
        return deletedCount;
    } catch (error) {
        console.error('Error en cleanOldEvents:', error);
        return 0;
    }
}
