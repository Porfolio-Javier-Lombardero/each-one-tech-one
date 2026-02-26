export const STALE_TIMES = {
  NEWS: 5 * 60 * 60 * 1000, // 5 horas
  EVENTS: 15 * 24 * 60 * 60 * 1000, // 15 días
  REVIEWS: 24 * 60 * 60 * 1000, // 24 horas
} as const;