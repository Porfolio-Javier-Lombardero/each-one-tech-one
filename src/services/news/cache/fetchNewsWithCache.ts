import { DateFilterType, News } from '../interfaces/d.news.types';
import { supabase } from '@/services/api/config/supabaseClient';

/**
 * Fetch de noticias vía Edge Function con caché en Supabase
 * La lógica de caché y fetch a APIs externas está en la Edge Function
 */
interface Props {
    topic: number | string;
    dateFilter: DateFilterType;
    page:number;
}
export async function fetchNewsWithCache(
    {topic,
    dateFilter,
    page} : Props
): Promise<News> {
    try {
        // Invocar Edge Function get-news (maneja caché + APIs externas)
        const { data, error } = await supabase.functions.invoke('get-news', {
            body: { topic, dateFilter, page },
        });

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('❌ Error en fetchNewsWithCache:', error);
        throw error;
    }
}

