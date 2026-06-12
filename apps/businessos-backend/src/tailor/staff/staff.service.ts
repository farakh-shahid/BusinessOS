import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import {
  normalizeUserEmail,
  normalizeUserPhone,
} from "../../common/utils/user-contact.util";
import { PrismaService } from "../../core/database/prisma.service";
import type { CreateStaffDto, UpdateStaffDto } from "./dto/staff.dto";

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" },
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email ?? undefined,
      phone: u.phone ?? undefined,
      role: u.role === "SUPER_ADMIN" ? "ADMIN" : u.role,
      createdAt: u.createdAt.toISOString(),
    }));
  }

  async create(tenantId: string, dto: CreateStaffDto) {
    const emailRaw = dto.email?.trim();
    const phoneRaw = dto.phone?.trim();

    if (!emailRaw && !phoneRaw) {
      throw new BadRequestException("Email or phone number is required");
    }

    const email = emailRaw ? normalizeUserEmail(emailRaw) : null;
    const phone = phoneRaw ? normalizeUserPhone(phoneRaw) : null;

    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new ConflictException("Email already in use");
      }
    }

    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        throw new ConflictException("Phone number already in use");
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        name: dto.name.trim(),
        email,
        phone,
        passwordHash,
        role: dto.role,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async update(
    tenantId: string,
    userId: string,
    dto: UpdateStaffDto,
    actorUserId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });
    if (!user) throw new NotFoundException("Staff member not found");

    if (userId === actorUserId && dto.role !== user.role) {
      throw new ForbiddenException("You cannot change your own role");
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name.trim(), role: dto.role },
    });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email ?? undefined,
      phone: updated.phone ?? undefined,
      role: updated.role,
      createdAt: updated.createdAt.toISOString(),
    };
  }
}
