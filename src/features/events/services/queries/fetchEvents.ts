import { Events } from '@/domain/Event';
import { supabase } from '@/shared/lib/supabaseClient';
import { parseList } from '@/shared/lib/parseList';
import { EventSchema } from '@/features/events/services/event.schema';
import { mapGeminiToEvent } from '@/features/events/services/mappers/mapGeminiToEvent';

export async function fetchEvents(): Promise<Events> {
    try {
        const { data, error } = await supabase.functions.invoke('get-events');

        if (error) throw error;

        const mapped = mapGeminiToEvent(data.text);
        return parseList(EventSchema, mapped, 'get-events');
    } catch (error) {
        console.error('❌ Error en fetchEvents:', error);
        throw error;
    }
}
