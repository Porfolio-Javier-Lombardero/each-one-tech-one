/**
 * Genera un ID corto (16 caracteres) y determinístico a partir de una URL
 * Utiliza un hash simple para garantizar la unicidad
 * @param url - URL única del artículo/evento/review
 * @returns ID de 16 caracteres alfanumérico
 */
export function generateShortId(url: string): string {
  // Simple hash basado en la URL
  let hash = 0;
  
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a entero de 32 bits
  }
  
  // Convertir a base36 y asegurar 16 caracteres
  const id = Math.abs(hash).toString(36).padStart(16, '0');
  
  return id.slice(0, 16);
}
