import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";
import { EventsSlice, NewsSlice, ReviewsSlice } from "./slices/interfaces/d.slices.types";
import { createNewsSlice } from "./slices/newsSlice";
import { createEventsSlice } from "./slices/eventsSlice";
import { createReviewsSlice } from "./slices/reviewsSlice";

type StoreState = NewsSlice & EventsSlice & ReviewsSlice;

export const useStore = create<StoreState>()(
  devtools(
    persist(
      ((...a) => ({
        ...createNewsSlice(...a),
        ...createEventsSlice(...a),
        ...createReviewsSlice(...a)

      })),
      { name: 'EachOne-store' }
    ),
    { name: 'EachOneTechOne Store' }
  )
);