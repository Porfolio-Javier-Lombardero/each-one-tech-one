export const mapEvents = (data: string) => {
    // Extraer solo el contenido entre <ul> y </ul>
    const ulStart = data.indexOf("<ul>");
    const ulEnd = data.indexOf("</ul>");

    if (ulStart === -1 || ulEnd === -1) {
        console.error('No se encontró estructura <ul></ul> válida');
        return [];
    }

    const mappedEvents = data.substring(ulStart + 4, ulEnd);

    // Extraer todos los <li> y limpiar
    const liRegex = /<li>(.*?)<\/li>/gi;
    const matches = mappedEvents.matchAll(liRegex);

    const listItems = Array.from(matches)
        .map(match => match[1]?.trim() ?? "")
        .filter(item => {
            // Filtrar items vacíos, con solo espacios, o con texto explicativo
            if (!item || item.length < 10) return false;
            // Verificar que tenga formato de fecha al inicio (mes + número)
            const hasDateFormat = /^[A-Za-z]+\s+\d/.test(item);
            return hasDateFormat;
        });

    return listItems;
}
