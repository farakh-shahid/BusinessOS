import { Injectable } from "@nestjs/common";
import type { OrderAuditAction } from "../../generated/prisma/client";
import { PrismaService } from "../../core/database/prisma.service";

@Injectable()
export class OrderAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    tenantId: string,
    orderId: string,
    userId: string,
    action: OrderAuditAction,
    details: Record<string, unknown> = {},
  ) {
    return this.prisma.orderAuditLog.create({
      data: {
        tenantId,
        orderId,
        userId,
        action,
        details: details as object,
      },
    });
  }

  async listForOrder(tenantId: string, orderId: string) {
    const rows = await this.prisma.orderAuditLog.findMany({
      where: { tenantId, orderId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const userIds = [...new Set(rows.map((r) => r.userId))];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const nameById = new Map(users.map((u) => [u.id, u.name]));

    return rows.map((row) => ({
      id: row.id,
      action: row.action,
      details: row.details as Record<string, unknown>,
      userName: nameById.get(row.userId) ?? "Staff",
      createdAt: row.createdAt.toISOString(),
    }));
  }
}
