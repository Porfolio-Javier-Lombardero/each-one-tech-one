import type { Event } from '@/domain/Event';

export function mapGeminiToEvent(rawText: string): Event[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawText, 'text/html');
  const items = Array.from(doc.querySelectorAll('li'));

  return items
    .map((li) => li.textContent?.trim() ?? '')
    .filter((text) => text.length >= 10 && /^[A-Za-z]+\s+\d/.test(text))
    .map((str) => {
      const [date, title, location, url] = str.split(',').map((s) => s?.trim());
      return {
        title: title ?? '',
        location: location ?? '',
        date: date ?? '',
        url: url ?? '',
      };
    });
}
