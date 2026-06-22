import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });
  }

  findByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ phone }, { phone2: phone }],
      },
      include: { tenant: true },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tenant: true },
    });
  }

  async assertPhoneAvailable(phone: string, excludeUserId?: string) {
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

  updateProfile(
    userId: string,
    data: {
      name: string;
      specialty?: string | null;
      phone?: string | null;
      phone2?: string | null;
      passwordHash?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name.trim(),
        specialty: data.specialty?.trim() || null,
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.phone2 !== undefined ? { phone2: data.phone2 } : {}),
        ...(data.passwordHash ? { passwordHash: data.passwordHash } : {}),
      },
      include: { tenant: true },
    });
  }
}
