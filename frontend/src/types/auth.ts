export interface JwtPayload {
  exp: number;
  sub: string;
  email: string;
  role: "user" | "admin";
}
