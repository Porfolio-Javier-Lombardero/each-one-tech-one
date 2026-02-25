
export interface EventsCacheRow {
  id: number;
  event_date: string;
  event_name: string;
  event_city: string;
  event_url: string | null;
  source: string | null;
  raw_text: string;
  created_at: string;
  updated_at: string;
  fetch_count: number;
}