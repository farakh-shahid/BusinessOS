import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { UpdateTenantSettingsDto } from "./dto/update-tenant-settings.dto";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");
    return {
      id: tenant.id,
      name: tenant.name,
      phone: tenant.phone ?? undefined,
      email: tenant.email ?? undefined,
      address: tenant.address ?? undefined,
      whatsappFooter: tenant.whatsappFooter ?? undefined,
    };
  }

  async update(tenantId: string, dto: UpdateTenantSettingsDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: dto.name?.trim(),
        phone: dto.phone?.trim() || null,
        email: dto.email?.trim() || null,
        address: dto.address?.trim() || null,
        whatsappFooter: dto.whatsappFooter?.trim() || null,
      },
    });
    return {
      id: tenant.id,
      name: tenant.name,
      phone: tenant.phone ?? undefined,
      email: tenant.email ?? undefined,
      address: tenant.address ?? undefined,
      whatsappFooter: tenant.whatsappFooter ?? undefined,
    };
  }
}
