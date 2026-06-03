/**
 * Hace scroll suave hasta un elemento específico por su ID
 * @param elementId - ID del elemento al que hacer scroll (sin el #)
 * @param offset - Offset opcional desde el top del elemento (útil para headers fijos)
 */
export const scrollToElement = (elementId: string, offset: number = 0): void => {
    try {
        const element = document.getElementById(elementId);

        if (!element) {
            console.warn(`Element with id "${elementId}" not found`);
            return;
        }

        // Obtener la posición del elemento
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        // Scroll suave hasta la posición
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Error scrolling to element:', error);
    }
};

/**
 * Hace scroll hasta el top de la página
 */
export const scrollToTop = (): void => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};