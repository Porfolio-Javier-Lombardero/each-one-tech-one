import { Events } from '../interfaces/d.events.types';
import { supabase } from '@/services/api/config/supabaseClient';

/**
 * Fetch de eventos vía Edge Function con caché en Supabase
 * La lógica de caché y fetch a Gemini API está en la Edge Function
 */
export async function fetchEventsWithCache(): Promise<Events> {
    try {
        // Invocar Edge Function get-events (maneja caché + Gemini API)
        const { data, error } = await supabase.functions.invoke('get-events');

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('❌ Error en fetchEventsWithCache:', error);
        throw error;
    }
}

