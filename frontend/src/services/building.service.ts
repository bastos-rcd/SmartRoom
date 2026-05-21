import API from "./api";

import type { Building } from "../types/building";

export const buildingService = {
  async getBuildingById(id: number): Promise<Building> {
    const response = await API.get(`/buildings/${id}`);

    return response.data;
  },
};
