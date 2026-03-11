
export const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Eliminar todos los elementos con la clase wp-block-techcrunch-inline-cta
  const ctaElements = doc.querySelectorAll('.wp-block-techcrunch-inline-cta');
  ctaElements.forEach(el => el.remove());

  // Hacer que las imágenes sean responsivas manteniendo aspect-ratio
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    const width = img.getAttribute('width');
    const height = img.getAttribute('height');
    
    // Si la imagen tiene dimensiones, calcular aspect-ratio
    if (width && height) {
      const aspectRatio = parseFloat(height) / parseFloat(width);
      img.style.aspectRatio = `${width} / ${height}`;
    }
    
    // Remover anchura y altura fijos
    img.removeAttribute('width');
    img.removeAttribute('height');
    
    // Aplicar estilos responsivos
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
  });

  // Hacer que las figuras sean responsivas
  const figures = doc.querySelectorAll('figure');
  figures.forEach(figure => {
    figure.style.margin = '1rem auto';
    figure.style.padding = '0';
  });

  return doc.body.innerHTML;
};