import API from "./api";

import type { Room } from "../types/room";

export const roomService = {
  async getRooms(): Promise<Room[]> {
    const response = await API.get(`/rooms`);

    return response.data;
  },

  async getRoomById(id: number): Promise<Room> {
    const response = await API.get(`/rooms/${id}`);

    return response.data;
  },
};
