import API from "./api";

import type { User } from "../types/user";

export const userService = {
  async getUserById(id: number): Promise<User> {
    const response = await API.get("/users/" + id);

    return response.data;
  },
  async getAllUsers(): Promise<User[]> {
    const response = await API.get("/users");

    return response.data;
  },
  async deleteUser(id: number): Promise<void> {
    await API.delete(`/users/${id}`);
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  },
};
