// Generates a stable 16-char key from the article URL. Needed because the API does not return a consistent ID across calls, and React requires a stable key for list rendering.
export function generateShortId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const id = Math.abs(hash).toString(36).padStart(16, '0');
  return id.slice(0, 16);
}
