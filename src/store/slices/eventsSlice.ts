import { StateCreator } from "zustand";
import { EventsSlice } from "./types/d.slices.types";
import { fetchEvents } from "@/services/api/setEventsFetch";
import { mapEvents } from "@/services/utils/mapEvents";

export const createEventsSlice: StateCreator<EventsSlice,[],[],EventsSlice> = (set, get) => ({
  events: undefined,
  loadingEvents: false,
  error: undefined,
  //Actions
  searchTechEvents: async () => {
    if (get().events) {
      console.log("📦 Using cached events");
      return;
    }

    set({ loadingEvents: true });
    try {
      const data = await fetchEvents();

      const mappedEvents = mapEvents(data);

      set({
        loadingEvents: false,
        events: mappedEvents ?? undefined,
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
