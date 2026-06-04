function calcTimeDiff(updatedAt: string): number {
  return Date.now() - new Date(updatedAt).getTime();
}

/**
 * Verifica si los datos del caché aún están frescos
 * @param updatedAt - Timestamp de la última actualización
 * @param staleTime - Tiempo en ms después del cual los datos se consideran obsoletos
 * @returns true si los datos están frescos, false si están obsoletos
 */
export function isCacheFresh(updatedAt: string, staleTime: number): boolean {
  return calcTimeDiff(updatedAt) < staleTime;
}

/**
 * Calcula cuánto tiempo queda antes de que expire el caché
 * @param updatedAt - Timestamp de la última actualización
 * @param staleTime - Tiempo en ms después del cual los datos se consideran obsoletos
 * @returns tiempo restante en ms, o 0 si ya expiró
 */
export function getRemainingCacheTime(updatedAt: string, staleTime: number): number {
  const remaining = staleTime - calcTimeDiff(updatedAt);
  return remaining > 0 ? remaining : 0;
}
