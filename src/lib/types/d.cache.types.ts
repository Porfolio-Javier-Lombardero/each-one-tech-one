import { DateFilterType, News } from "./d.news.types";

/**
 * Interfaz para el caché de categorías en Zustand (memoria local del navegador)
 * Este caché es diferente del de Supabase:
 * - Supabase: Caché persistente de 7 días que comparten todos los usuarios
 * - Zustand: Caché en memoria de la sesión actual del usuario
 * 
 * Evita re-fetching innecesario cuando el usuario navega dentro de la misma sesión
 */
export interface CategoryCache {
    category: number | string; // ID de categoría (449, 450, etc.) o 'foundAtWeb' para búsquedas
    dateFilter: DateFilterType; // today, yesterday, lastWeek, all
    news: News; // Array de noticias ya filtradas
}
