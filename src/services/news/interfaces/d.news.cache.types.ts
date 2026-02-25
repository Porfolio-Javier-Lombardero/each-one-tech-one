export interface NewsCacheRow {
  id: number;
  techcrunch_id: number;
  source: string;
  titulo: string;
  description: string | null;
  cont: string | null;
  categories: number[] | null;
  fecha_iso: string;
  url: string;
  img: string | null;
  created_at: string;
  updated_at: string;
  fetch_count: number;
  search_context: string | null;
}