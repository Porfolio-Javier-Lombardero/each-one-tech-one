export type Events = string[]

// Tipo para eventos cacheados en Supabase
export interface CachedEvent {
    id: number;
    event_date: string;
    event_name: string;
    event_city: string;
    event_url: string | null;
    source: string;
    raw_text: string;
    created_at: string;
    updated_at: string;
    fetch_count: number;
}