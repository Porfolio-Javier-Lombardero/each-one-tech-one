import { Review } from './d.reviews.types';

// Interfaz cache que extiende Review con metadatos
export interface ReviewsCacheRow extends Review {
  id: number;
  source: string;
  created_at: string;
  updated_at: string;
  fetch_count: number;
}