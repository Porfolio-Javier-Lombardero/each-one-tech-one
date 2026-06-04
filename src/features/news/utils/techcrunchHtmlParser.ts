export const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('.wp-block-techcrunch-inline-cta').forEach(el => el.remove());

  doc.querySelectorAll('img').forEach(img => {
    const width = img.getAttribute('width');
    const height = img.getAttribute('height');
    if (width && height) {
      img.style.aspectRatio = `${width} / ${height}`;
    }
    img.removeAttribute('width');
    img.removeAttribute('height');
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
  });

  doc.querySelectorAll('figure').forEach(figure => {
    figure.style.margin = '1rem auto';
    figure.style.padding = '0';
  });

  return doc.body.innerHTML;
};

export const stripHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};
