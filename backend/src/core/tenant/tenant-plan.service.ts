import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  checkMemberAddition,
  checkRoleChange,
  type TenantMemberCounts,
  type TenantPlan,
} from "@shared";
import type { UserRole } from "../../generated/prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class TenantPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async getTenantPlan(tenantId: string): Promise<TenantPlan> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true },
    });
    if (!tenant) {
      throw new NotFoundException("Shop not found");
    }
    return tenant.plan;
  }

  async countActiveMembers(tenantId: string): Promise<TenantMemberCounts> {
    const users = await this.prisma.user.findMany({
      where: { tenantId, isActive: true },
      select: { role: true },
    });

    return {
      total: users.length,
      staff: users.filter((u) => u.role === "STAFF").length,
      tailors: users.filter((u) => u.role === "TAILOR").length,
    };
  }

  async assertCanAddMember(
    tenantId: string,
    role: "STAFF" | "TAILOR",
  ): Promise<void> {
    const [plan, counts] = await Promise.all([
      this.getTenantPlan(tenantId),
      this.countActiveMembers(tenantId),
    ]);
    const result = checkMemberAddition(plan, counts, role);
    if (!result.ok) {
      throw new BadRequestException(result.reason);
    }
  }

  async assertCanChangeRole(
    tenantId: string,
    currentRole: UserRole,
    newRole: "STAFF" | "TAILOR",
  ): Promise<void> {
    if (currentRole !== "STAFF" && currentRole !== "TAILOR") {
      return;
    }
    if (currentRole === newRole) {
      return;
    }

    const [plan, counts] = await Promise.all([
      this.getTenantPlan(tenantId),
      this.countActiveMembers(tenantId),
    ]);
    const result = checkRoleChange(plan, counts, currentRole, newRole);
    if (!result.ok) {
      throw new BadRequestException(result.reason);
    }
  }

  async updateTenantPlan(tenantId: string, plan: TenantPlan) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, plan: true },
    });
    if (!tenant) {
      throw new NotFoundException("Shop not found");
    }

    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan },
      select: { id: true, name: true, plan: true },
    });

    return updated;
  }
}
