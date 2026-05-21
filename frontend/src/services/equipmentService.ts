import API from "./api";
import type { Equipment } from "../types/equipment";

export const equipmentService = {
  async getEquipments(): Promise<Equipment[]> {
    const response = await API.get("/equipments");
    return response.data;
  },

  async createEquipment(equipment: Omit<Equipment, "id">): Promise<Equipment> {
    const response = await API.post("/equipments", equipment);
    return response.data;
  },
};
