import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { parseLoginIdentifier } from "../../common/utils/user-contact.util";
import type { AuthUser } from "../../common/types/auth-user.type";
import { LoginDto } from "./dto/login.dto";
import { UserRepository } from "./user.repository";

export interface LoginResult {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: AuthUser["role"];
    tenantId: string | null;
    tenantName: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const { type, value } = parseLoginIdentifier(dto.login);
    const user =
      type === "email"
        ? await this.users.findByEmail(value)
        : await this.users.findByPhone(value);

    if (!user) {
      throw new UnauthorizedException("Invalid login or password");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid login or password");
    }

    const payload: AuthUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant?.name ?? null,
      },
    };
  }

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant?.name ?? null,
    };
  }
}
