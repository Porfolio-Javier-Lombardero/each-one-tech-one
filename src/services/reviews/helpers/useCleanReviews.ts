/**
 * Extrae los iframes de una respuesta de Gemini que contiene código embed de YouTube.
 * @param {string} response - Respuesta completa de la API Gemini.
 * @returns {string[]} - Lista de strings con el HTML de los iframes.
 */
export const cleanReviewsEmbed = (response: string): string[] => {
    // Busca todos los iframes en la respuesta
    const matches = response.match(/<iframe[\s\S]*?<\/iframe>/g);
    return matches ? matches.map(iframe => iframe.trim()) : [];
};

