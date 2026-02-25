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

