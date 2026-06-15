import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { AuthUser } from "../../common/types/auth-user.type";
import { appConfig } from "../../config/app.config";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly users: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  async validate(payload: AuthUser): Promise<AuthUser> {
    const user = await this.users.findById(payload.id);
    if (!user?.isActive) {
      throw new UnauthorizedException("Account access has been revoked");
    }
    return payload;
  }
}
