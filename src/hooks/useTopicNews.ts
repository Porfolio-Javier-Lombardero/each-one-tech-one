import { useEffect } from "react";
import { DateFilterType } from "@/lib/types/d.news.types";

import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { useStore } from "@/store";

export const useTopicNews = (
    topic: string | undefined,
    dateFilter: DateFilterType = 'today'
) => {
    const { getTopicId } = useCategoryFilter();
    const searchByCategory = useStore(state => state.searchByCategory);
    const loading = useStore((state) => state.loadingNews);
    const filteredNews = useStore((state) => state.filteredNews);

    // 1. BÚSQUEDA EN CACHÉ (se ejecuta en cada render)
    // En el primer render puede retornar undefined si no existe en caché
    const topicId = topic === 'foundAtWeb' ? 'foundAtWeb' : getTopicId(topic);
    const topicNews = filteredNews.find(
        (n) => n.category === topicId && n.dateFilter === dateFilter
    )?.news;

    // 2. EFECTO DE FETCH (se ejecuta DESPUÉS del render)
    // Si topicNews es undefined, dispara el fetch que actualizará el store
    // El store actualizado causa un re-render donde topicNews YA tendrá datos
    useEffect(() => {
        // No hacer fetch para búsquedas, ya están en caché
        if (topic === 'foundAtWeb') return;

        if (topicId !== undefined) {
            // Verificar caché ANTES de disparar el fetch (doble verificación)
            const alreadyInCache = filteredNews.some(
                (n) => n.category === topicId && n.dateFilter === dateFilter
            );

            if (!alreadyInCache) {
                searchByCategory(topicId, dateFilter);
            }
        }
    }, [topicId, dateFilter]);


    return { topicNews, loading };
};
