
import { Event } from '@/domain/Event';

// Interfaz DB con metadatos de caché
export interface EventsCacheRow extends Event {
  id: number;
  source: string;
  created_at: string;
  updated_at: string;
  fetch_count: number;
}