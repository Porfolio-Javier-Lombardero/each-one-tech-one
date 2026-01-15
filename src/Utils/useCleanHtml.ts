
export const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Eliminar todos los elementos con la clase wp-block-techcrunch-inline-cta
  const ctaElements = doc.querySelectorAll('.wp-block-techcrunch-inline-cta');
  ctaElements.forEach(el => el.remove());

  return doc.body.innerHTML;
};