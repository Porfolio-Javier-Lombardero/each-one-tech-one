import { Review, SearchResultItem } from './interfaces/d.reviews.types';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchReviews = async (): Promise<Review[]> => {
  const query = encodeURIComponent('tech gadget +"review" unboxing 2026 -shorts');
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&order=relevance&relevanceLenguage=en&regionCode=US&maxResults=6&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No se obtuvieron reviews');
    }

    // ✨ Mapear una sola vez al formato plano
    return data.items.map((item: SearchResultItem): Review => ({
      video_id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description || '',
      thumbnail_url: item.snippet.thumbnails.high.url || '',
      channel_title: item.snippet.channelTitle || '',
      published_at: item.snippet.publishedAt,
      video_kind: item.id.kind || 'youtube#video',
    }));
  } catch (error) {
    console.error("Error cargando noticias de video", error);
    throw error;
  }
};


