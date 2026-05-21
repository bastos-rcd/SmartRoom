import API from "./api";

import type { Request } from "../types/request";

export const requestService = {
  async getAllRequests(): Promise<Request[]> {
    const response = await API.get("/requests");

    return response.data;
  },
  async getRequestById(id: number): Promise<Request> {
    const response = await API.get("/requests/" + id);

    return response.data;
  },
  async createRequest(request: Request): Promise<Request> {
    const response = await API.post("/requests", request);

    return response.data;
  },
  async updateRequest(id: number, request: Request): Promise<void> {
    await API.put("/requests/" + id, request);
  },
  async deleteRequest(id: number): Promise<void> {
    await API.delete("/requests/" + id);
  },
};
