import { BadRequestException, Injectable } from "@nestjs/common";
import type { CustomerDetail, CustomerSearchResult } from "@business-os/tailor";
import { PrismaService } from "../../core/database/prisma.service";
import {
  formatDueDate,
  garmentKey,
  garmentLabel,
  resolveDisplayStatus,
  toLocalePreference,
} from "../common/tailor.mapper";
import { toMeasurementDto } from "../measurement/measurement.mapper";
import { requirePakistanPhone } from "../../common/utils/pakistan-phone.util";
import type { CreateCustomerDto } from "./dto/create-customer.dto";
import type { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listByTenant(tenantId: string) {
    const rows = await this.prisma.customer.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
    });

    return rows.map((row) => this.toCustomer(row));
  }

  async search(tenantId: string, query: string): Promise<CustomerSearchResult[]> {
    const q = query.trim();
    const rows = await this.prisma.customer.findMany({
      where: {
        tenantId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
        ],
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
      take: 10,
    });

    return rows.map((row) => {
      const garmentCountMap = new Map<string, { garmentType: string; garmentLabel: string; count: number }>();

      for (const order of row.orders) {
        const key = garmentKey(order.garmentType);
        const label = garmentLabel(order.garmentType);
        const existing = garmentCountMap.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          garmentCountMap.set(key, {
            garmentType: key,
            garmentLabel: label,
            count: 1,
          });
        }
      }

      return {
        customer: this.toCustomer(row),
        totalOrders: row.orders.length,
        garmentCounts: Array.from(garmentCountMap.values()).sort(
          (a, b) => b.count - a.count,
        ),
        orders: row.orders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          garmentType: garmentKey(order.garmentType),
          garmentLabel: garmentLabel(order.garmentType),
          status: resolveDisplayStatus(order.status, order.deliveryDate),
          deliveryDate: formatDueDate(order.deliveryDate),
          totalPrice: Number(order.totalPrice),
        })),
      };
    });
  }

  async findById(tenantId: string, id: string) {
    const row = await this.prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!row) {
      throw new BadRequestException("Customer not found");
    }

    return row;
  }

  async getDetail(tenantId: string, id: string): Promise<CustomerDetail> {
    const row = await this.prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        measurements: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!row) {
      throw new BadRequestException("Customer not found");
    }

    const latest = row.measurements[0];

    return {
      customer: this.toCustomer(row),
      latestMeasurement: latest ? toMeasurementDto(latest) : null,
    };
  }

  async update(tenantId: string, id: string, dto: UpdateCustomerDto) {
    await this.findById(tenantId, id);

    try {
      const row = await this.prisma.customer.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.phone !== undefined
            ? { phone: requirePakistanPhone(dto.phone) }
            : {}),
          ...(dto.email !== undefined
            ? { email: dto.email.trim() || null }
            : {}),
        },
      });

      return this.toCustomer(row);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new BadRequestException(
          "Another customer already uses this phone number",
        );
      }
      throw error;
    }
  }

  async create(tenantId: string, dto: CreateCustomerDto) {
    const row = await this.prisma.customer.create({
      data: {
        tenantId,
        name: dto.name.trim(),
        phone: requirePakistanPhone(dto.phone),
        email: dto.email?.trim() || null,
        preferredLocale: toLocalePreference(dto.preferredLocale),
      },
    });

    return this.toCustomer(row);
  }

  private toCustomer(row: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    preferredLocale: "EN" | "UR";
  }) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email ?? undefined,
      preferredLocale: row.preferredLocale === "UR" ? ("ur" as const) : ("en" as const),
    };
  }
}
