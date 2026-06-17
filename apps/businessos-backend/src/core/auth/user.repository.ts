import { Injectable } from "@nestjs/common";
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
    return this.prisma.user.findUnique({
      where: { phone },
      include: { tenant: true },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tenant: true },
    });
  }

  updateProfile(userId: string, data: { name: string; specialty?: string | null }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name.trim(),
        specialty: data.specialty?.trim() || null,
      },
      include: { tenant: true },
    });
  }
}
