import { StateCreator } from "zustand";
import { EventsSlice } from "./interfaces/d.slices.types";
import { fetchEvents } from "../../services/events/setEventsFetch";

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
      // Servicio maneja caché y fetch (patrón estandarizado)
      const events = await fetchEvents();

      set({
        events,
        loadingEvents: false,
        error: undefined,
      });
    } catch (err) {
      set({
        events: undefined,
        loadingEvents: false,
        error: String(err),
      });
    }
  },
});
