import { GoogleGenerativeAI } from "@google/generative-ai";

import { mapEvents } from '@/services/events/helpers/mapEvents';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const prompt = "List major tech events (conferences, fairs, trade shows) in Europe and USA for 2026. Return ONLY raw HTML code without any explanatory text, comments, or markdown. Start directly with <ul> and end with </ul>. Each <li> must follow this exact format: Month Day Year, Event Name, City, event_url. Example: <li>January 6-9 2026, CES, Las Vegas, https://ces.tech</li>. Use English only. Do not include any text before <ul> or after </ul>."

/**
 * Obtener eventos con caché integrado (patrón estandarizado)
 */
export const fetchEvents = async () => {
  // 1️⃣ Intentar obtener del caché de Supabase



  console.log('📭 No hay caché, consultando Gemini API...');

  // 2️⃣ Si no hay caché, consultar Gemini API
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawHtml = response.text();

    // Transformar HTML a objetos
    const mappedEvents = mapEvents(rawHtml);

    if (!mappedEvents || mappedEvents.length === 0) {
      throw new Error('No se obtuvieron eventos');
    }

  
 

    return mappedEvents;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};