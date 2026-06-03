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

