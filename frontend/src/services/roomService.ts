import API from "./api";

import type { Room } from "../types/room";

export const roomService = {
  async getRoomById(id: number): Promise<Room> {
    const response = await API.get(`/rooms/${id}`);

    return response.data;
  },
};
