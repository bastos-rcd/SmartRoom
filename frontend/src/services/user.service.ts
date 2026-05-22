import API from "./api";

import type { User } from "../types/user";

export const userService = {
  async getUserById(id: number): Promise<User> {
    const response = await API.get("/users/" + id);

    return response.data;
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  },
};
