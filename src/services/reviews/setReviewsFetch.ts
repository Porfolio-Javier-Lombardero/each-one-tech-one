const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchReviews = async () => {

// 2️⃣ Si no hay caché, consultar YouTube API
  const query = encodeURIComponent('tech gadget +"review" unboxing 2026 -shorts');
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&order=relevance&relevanceLenguage=en&regionCode=US&maxResults=6&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No se obtuvieron reviews');
    }
  return data.items;
  } catch (error) {
    console.error("Error cargando noticias de video", error);
    throw error;
  }
};


