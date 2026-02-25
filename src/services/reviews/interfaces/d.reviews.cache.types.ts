export interface ReviewsCacheRow {
  id: number;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  channel_title: string | null;
  published_at: string;
  source: string | null;
  video_kind: string | null;
  created_at: string;
  updated_at: string;
  fetch_count: number;
}