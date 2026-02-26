
import { EventProps } from './d.events.types';

// Interfaz DB con metadatos de caché
export interface EventsCacheRow extends EventProps {
  id: number;
  source: string;
  created_at: string;
  updated_at: string;
  fetch_count: number;
}