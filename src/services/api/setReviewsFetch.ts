import { getReviewsFromCache, saveReviewsToCache } from './reviewsCacheService';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * Obtener reviews con caché integrado (patrón estandarizado)
 */
export const fetchReviews = async () => {
  // 1️⃣ Intentar obtener del caché de Supabase
  const cachedReviews = await getReviewsFromCache(24, 6); // 24 horas, 6 videos

  if (cachedReviews && cachedReviews.length > 0) {
    console.log('✅ Reviews obtenidos del caché de Supabase');
    return cachedReviews;
  }

  console.log('📭 No hay caché, consultando YouTube API...');

  // 2️⃣ Si no hay caché, consultar YouTube API
  const query = encodeURIComponent('tech gadget +"review" unboxing 2026 -shorts');
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&order=relevance&relevanceLenguage=en&regionCode=US&maxResults=6&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No se obtuvieron reviews');
    }

    // 3️⃣ Guardar en caché para la próxima vez
    await saveReviewsToCache(data.items);

    return data.items;
  } catch (error) {
    console.error("Error cargando noticias de video", error);
    throw error;
  }
};


