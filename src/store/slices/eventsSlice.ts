import { StateCreator } from "zustand";
import { EventsSlice } from "./types/d.slices.types";
import { fetchEvents } from "@/services/api/setEventsFetch";
import { mapEvents } from "@/services/utils/mapEvents";
import { getEventsFromCache, saveEventsToCache } from "@/services/api/eventsCacheService";

export const createEventsSlice: StateCreator<EventsSlice, [], [], EventsSlice> = (set, get) => ({
  events: undefined,
  loadingEvents: false,
  error: undefined,
  //Actions
  searchTechEvents: async () => {
    if (get().events) {
      console.log("📦 Using cached events (Zustand)");
      return;
    }

    set({ loadingEvents: true });

    try {
      // 1. Intentar obtener del caché de Supabase
      const cachedEvents = await getEventsFromCache(30); // 30 días

      if (cachedEvents && cachedEvents.length > 0) {
        console.log("✅ Eventos obtenidos del caché de Supabase");
        set({
          loadingEvents: false,
          events: cachedEvents,
          error: undefined,
        });
        return;
      }

      console.log("📭 No hay caché, consultando Gemini API...");

      // 2. Si no hay caché, consultar Gemini API
      const data = await fetchEvents();
      const mappedEvents = mapEvents(data);

      if (!mappedEvents || mappedEvents.length === 0) {
        throw new Error('No se obtuvieron eventos');
      }

      // 3. Guardar en caché para la próxima vez
      await saveEventsToCache(mappedEvents);

      set({
        loadingEvents: false,
        events: mappedEvents,
        error: undefined,
      });
    } catch (err) {
      set({
        events: undefined,
        loadingEvents: false,
        error: String(err),
      });
    } finally {
      set({ loadingEvents: false });
    }
  },
});
