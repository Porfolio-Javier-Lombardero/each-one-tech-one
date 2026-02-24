// types.ts
export interface SearchResultItem {
  id: {
    kind: string;
    videoId: string; // <-- Aquí está el ID que necesitamos
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

// Tipo para reviews cacheados en Supabase
export interface CachedReview {
  id: number;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  channel_title: string | null;
  published_at: string;
  source: string;
  video_kind: string;
  created_at: string;
  updated_at: string;
  fetch_count: number;
}