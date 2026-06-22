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
import { TenantPlanService } from "../../core/tenant/tenant-plan.service";
import type { CreateStaffDto, UpdateStaffDto } from "./dto/staff.dto";

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPlans: TenantPlanService,
  ) {}

  private async assertPhoneAvailable(phone: string, excludeUserId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone }, { phone2: phone }],
        ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Phone number already in use");
    }
  }

  async list(tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: { tenantId, isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email ?? undefined,
      phone: u.phone ?? undefined,
      phone2: u.phone2 ?? undefined,
      role: u.role === "SUPER_ADMIN" ? "ADMIN" : u.role,
      specialty: u.specialty ?? undefined,
      createdAt: u.createdAt.toISOString(),
    }));
  }

  async create(tenantId: string, dto: CreateStaffDto) {
    const emailRaw = dto.email?.trim();
    const phoneRaw = dto.phone?.trim();
    const phone2Raw = dto.phone2?.trim();

    if (!emailRaw && !phoneRaw) {
      throw new BadRequestException("Email or phone number is required");
    }

    const email = emailRaw ? normalizeUserEmail(emailRaw) : null;
    const phone = phoneRaw ? normalizeUserPhone(phoneRaw) : null;
    const phone2 = phone2Raw ? normalizeUserPhone(phone2Raw) : null;

    if (phone && phone2 && phone === phone2) {
      throw new BadRequestException(
        "Second mobile number must be different from the first",
      );
    }

    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new ConflictException("Email already in use");
      }
    }

    if (phone) {
      await this.assertPhoneAvailable(phone);
    }

    if (phone2) {
      await this.assertPhoneAvailable(phone2);
    }

    await this.tenantPlans.assertCanAddMember(tenantId, dto.role);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        name: dto.name.trim(),
        email,
        phone,
        phone2,
        passwordHash,
        role: dto.role,
        specialty: dto.specialty?.trim() || null,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
      phone2: user.phone2 ?? undefined,
      role: user.role,
      specialty: user.specialty ?? undefined,
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

    const isAdminUser = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

    if (!isAdminUser && dto.role !== user.role) {
      await this.tenantPlans.assertCanChangeRole(tenantId, user.role, dto.role);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name.trim(),
        specialty: dto.specialty?.trim() || null,
        ...(isAdminUser ? {} : { role: dto.role }),
      },
    });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email ?? undefined,
      phone: updated.phone ?? undefined,
      phone2: updated.phone2 ?? undefined,
      role: updated.role === "SUPER_ADMIN" ? "ADMIN" : updated.role,
      specialty: updated.specialty ?? undefined,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async revokeAccess(tenantId: string, userId: string, actorUserId: string) {
    if (userId === actorUserId) {
      throw new ForbiddenException("You cannot revoke your own access");
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId, isActive: true },
    });
    if (!user) throw new NotFoundException("Staff member not found");

    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      const adminCount = await this.prisma.user.count({
        where: {
          tenantId,
          isActive: true,
          role: { in: ["ADMIN", "SUPER_ADMIN"] },
        },
      });
      if (adminCount <= 1) {
        throw new BadRequestException("Cannot revoke the last admin account");
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { revoked: true };
  }

  async setPassword(
    tenantId: string,
    userId: string,
    password: string,
    actorUserId: string,
  ) {
    if (userId === actorUserId) {
      throw new ForbiddenException(
        "Use profile settings to change your own password",
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId, isActive: true },
    });
    if (!user) throw new NotFoundException("Staff member not found");

    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { updated: true };
  }
}
