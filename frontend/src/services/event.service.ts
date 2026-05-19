import API from "./api";

import type { Event } from "../types/event";

export const eventService = {
  async getEvents(): Promise<Event[]> {
    const response = await API.get("/reservations");

    return response.data;
  },
};
