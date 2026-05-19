export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  status: number;
}
