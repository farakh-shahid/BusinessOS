import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserRole } from "../../generated/prisma/client";
import {
  normalizeUserPhone,
  parseLoginIdentifier,
} from "../../common/utils/user-contact.util";
import type { AuthUser } from "../../common/types/auth-user.type";
import { PrismaService } from "../database/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserRepository } from "./user.repository";

export interface LoginResult {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    phone2: string | null;
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
    private readonly prisma: PrismaService,
  ) {}

  private buildLoginResult(user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    phone2: string | null;
    role: AuthUser["role"];
    tenantId: string | null;
    tenant?: { name: string } | null;
  }): LoginResult {
    const payload: AuthUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      accessToken: "",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        phone2: user.phone2,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant?.name ?? null,
      },
    };
  }

  private async signLoginResult(
    result: LoginResult,
    payload: AuthUser,
  ): Promise<LoginResult> {
    const accessToken = await this.jwt.signAsync(payload);
    return { ...result, accessToken };
  }

  async signup(dto: SignupDto): Promise<LoginResult> {
    const phone = normalizeUserPhone(dto.phone.trim());
    await this.users.assertPhoneAvailable(phone);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const shopName = dto.shopName.trim();
    const ownerName = dto.name.trim();

    const created = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: shopName,
          phone,
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: ownerName,
          phone,
          passwordHash,
          role: UserRole.ADMIN,
          permissions: {},
        },
        include: { tenant: true },
      });

      return user;
    });

    const base = this.buildLoginResult(created);
    return this.signLoginResult(base, {
      id: created.id,
      email: created.email,
      phone: created.phone,
      name: created.name,
      role: created.role,
      tenantId: created.tenantId,
    });
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    const { type, value } = parseLoginIdentifier(dto.login);
    const user =
      type === "email"
        ? await this.users.findByEmail(value)
        : await this.users.findByPhone(value);

    if (!user) {
      throw new UnauthorizedException("Invalid login or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account access has been revoked");
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
        phone2: user.phone2,
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
      phone2: user.phone2,
      role: user.role,
      specialty: user.specialty ?? null,
      tenantId: user.tenantId,
      tenantName: user.tenant?.name ?? null,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const phoneRaw = dto.phone?.trim();
    const phone2Raw = dto.phone2?.trim();
    const phone = phoneRaw ? normalizeUserPhone(phoneRaw) : null;
    const phone2 = phone2Raw ? normalizeUserPhone(phone2Raw) : null;

    if (phone && phone2 && phone === phone2) {
      throw new BadRequestException(
        "Second mobile number must be different from the first",
      );
    }

    if (phone) {
      await this.users.assertPhoneAvailable(phone, userId);
    }
    if (phone2) {
      await this.users.assertPhoneAvailable(phone2, userId);
    }

    let passwordHash: string | undefined;
    const newPassword = dto.newPassword?.trim();
    if (newPassword) {
      const currentPassword = dto.currentPassword?.trim();
      if (!currentPassword) {
        throw new BadRequestException("Current password is required");
      }
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        throw new UnauthorizedException("Current password is incorrect");
      }
      passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await this.users.updateProfile(userId, {
      name: dto.name,
      specialty: dto.specialty,
      ...(dto.phone !== undefined ? { phone: phoneRaw ? phone : null } : {}),
      ...(dto.phone2 !== undefined ? { phone2: phone2Raw ? phone2 : null } : {}),
      passwordHash,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      phone2: updated.phone2,
      role: updated.role,
      specialty: updated.specialty ?? null,
      tenantId: updated.tenantId,
      tenantName: updated.tenant?.name ?? null,
    };
  }
}
