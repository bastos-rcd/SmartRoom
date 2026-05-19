import { jwtDecode } from "jwt-decode";

import API from "./api";

import type { JwtPayload } from "../types/auth";
import type { User } from "../types/user";

export const authService = {
  async login(email: string, password: string): Promise<void> {
    const response = await API.post("/login", { email, password });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
  },

  async register(user: Record<string, any>): Promise<User> {
    const response = await API.post("/register", user);

    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },

  getRole(): "user" | "admin" | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role;
    } catch {
      return null;
    }
  },
};
