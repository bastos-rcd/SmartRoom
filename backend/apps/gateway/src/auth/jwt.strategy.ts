import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "SECRET_PAR_DEFAUT_A_CHANGER",
    });
  }

  async validate(payload: any) {
    const userRole = payload.role ? payload.role.toUpperCase() : "USER";

    return {
      id: payload.sub,
      email: payload.email,
      roles: [userRole],
    };
  }
}
