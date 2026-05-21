import API from "./api";

import type { Event } from "../types/event";

export const eventService = {
  async getEvents(): Promise<Event[]> {
    const response = await API.get("/reservations");

    return response.data;
  },

  async createEvent(event: Event): Promise<Event> {
    console.log(event);

    const response = await API.post("/reservations", event);

    console.log(response);

    return response.data;
  },
};
