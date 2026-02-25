/**
 * Verifica si los datos del caché aún están frescos
 * @param updatedAt - Timestamp de la última actualización
 * @param staleTime - Tiempo en ms después del cual los datos se consideran obsoletos
 * @returns true si los datos están frescos, false si están obsoletos
 */
export function isCacheFresh(updatedAt: string, staleTime: number): boolean {
  const lastUpdate = new Date(updatedAt).getTime();
  const now = Date.now();
  const timeDiff = now - lastUpdate;
  
  return timeDiff < staleTime;
}

/**
 * Calcula cuánto tiempo queda antes de que expire el caché
 * @param updatedAt - Timestamp de la última actualización
 * @param staleTime - Tiempo en ms después del cual los datos se consideran obsoletos
 * @returns tiempo restante en ms, o 0 si ya expiró
 */
export function getRemainingCacheTime(updatedAt: string, staleTime: number): number {
  const lastUpdate = new Date(updatedAt).getTime();
  const now = Date.now();
  const timeDiff = now - lastUpdate;
  const remaining = staleTime - timeDiff;
  
  return remaining > 0 ? remaining : 0;
}