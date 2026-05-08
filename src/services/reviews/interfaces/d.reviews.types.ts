// Formato simplificado y plano para app Y DB
export interface Review {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  channel_title: string;
  published_at: string;
  video_kind: string;
}

export type Reviews = Review[];

// Tipo legacy para compatibilidad con YouTube API (solo interno)
export interface SearchResultItem {
  id: {
    kind: string;
    videoId: string;
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

