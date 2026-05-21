import API from "./api";

import type { Equipment } from "../types/equipment";

export const equipmentService = {
  async getEquipments(): Promise<Equipment[]> {
    const response = await API.get(`/equipments`);

    return response.data;
  },
};
