import { BadRequestException, Injectable } from "@nestjs/common";
import type {
  CustomerDetail,
  CustomerGarmentStyleProfile,
  CustomerListQuickFilterCounts,
  CustomerListQuickFilterKey,
  CustomerSearchResult,
  CustomerListEntry,
  OrderWorkflowStatus,
  PaginatedList,
  StyleValues,
} from "@shared";
import { DEFAULT_PAGE_SIZE } from "@shared";
import { PrismaService } from "../../core/database/prisma.service";
import {
  formatDueDate,
  fromCollarType,
  fromPlacketType,
  fromPocketOption,
  garmentKey,
  garmentLabel,
  orderStatusKey,
  resolveDisplayStatus,
  toLocalePreference,
} from "../common/tailor.mapper";
import { toMeasurementDto } from "../measurement/measurement.mapper";
import { normalizeStyleMap } from "../measurement/measurement-json.helper";
import { requirePakistanPhone } from "../../common/utils/pakistan-phone.util";
import type { CreateCustomerDto } from "./dto/create-customer.dto";
import type { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
import type { UpdateCustomerDto } from "./dto/update-customer.dto";
import { buildCustomerListWhere, CUSTOMER_QUICK_FILTER_KEYS } from "./customer-list-query.helper";
import type { CustomerFilterCountsQueryDto } from "./dto/customer-filter-counts-query.dto";

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listByTenant(
    tenantId: string,
    query?: ListCustomersQueryDto,
  ): Promise<PaginatedList<CustomerListEntry>> {
    const limit = Math.min(query?.limit ?? DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE);
    const offset = query?.offset ?? 0;

    const multiOrderCustomerIds =
      query?.segment === "new" || query?.segment === "regular"
        ? await this.customerIdsWithMultipleOrders(tenantId)
        : undefined;

    const rows = await this.prisma.customer.findMany({
      where: buildCustomerListWhere(tenantId, {
        q: query?.q,
        segment: query?.segment,
        multiOrderCustomerIds,
        registeredFrom: query?.registeredFrom,
        registeredTo: query?.registeredTo,
      }),
      include: {
        _count: { select: { orders: true } },
        orders: {
          select: { deliveryDate: true, updatedAt: true },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
        measurements: {
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
      take: limit + 1,
      skip: offset,
    });

    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit);
    const customerIds = page.map((row) => row.id);

    const balanceGroups =
      customerIds.length > 0
        ? await this.prisma.order.groupBy({
            by: ["customerId"],
            where: {
              customerId: { in: customerIds },
              status: { notIn: ["DELIVERED", "CANCELLED"] },
            },
            _sum: { balanceDue: true },
          })
        : [];

    const balanceByCustomer = new Map(
      balanceGroups.map((group) => [
        group.customerId,
        Number(group._sum.balanceDue ?? 0),
      ]),
    );

    return {
      items: page.map((row) => {
        const latest = row.orders[0];

        return {
          ...this.toCustomer(row),
          totalOrders: row._count.orders,
          outstandingBalance: balanceByCustomer.get(row.id) ?? 0,
          lastOrderDate: latest
            ? formatDueDate(latest.deliveryDate)
            : undefined,
          hasMeasurements: row.measurements.length > 0,
        };
      }),
      hasMore,
      nextOffset: hasMore ? offset + limit : null,
    };
  }

  async getQuickFilterCounts(
    tenantId: string,
    query?: CustomerFilterCountsQueryDto,
  ): Promise<CustomerListQuickFilterCounts> {
    const multiOrderCustomerIds = await this.customerIdsWithMultipleOrders(tenantId);

    const entries = await Promise.all(
      CUSTOMER_QUICK_FILTER_KEYS.map(async (segmentKey) => {
        const where = buildCustomerListWhere(tenantId, {
          q: query?.q,
          segment: segmentKey || undefined,
          multiOrderCustomerIds,
          registeredFrom: query?.registeredFrom,
          registeredTo: query?.registeredTo,
        });
        const count = await this.prisma.customer.count({ where });
        const key: CustomerListQuickFilterKey =
          segmentKey === "" ? "all" : (segmentKey as Exclude<CustomerListQuickFilterKey, "all">);
        return [key, count] as const;
      }),
    );

    return Object.fromEntries(entries) as CustomerListQuickFilterCounts;
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
          include: { createdBy: { select: { name: true } } },
        },
      },
      orderBy: [{ name: "asc" }, { phone: "asc" }],
      take: 30,
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
          workflowStatus: orderStatusKey(order.status) as OrderWorkflowStatus,
          bookingDate: formatDueDate(order.bookingDate),
          deliveryDate: formatDueDate(order.deliveryDate),
          totalPrice: Number(order.totalPrice),
          advancePaid: Number(order.advancePaid),
          balanceDue: Number(order.balanceDue),
          bookedByName: order.createdBy?.name,
          cuttingMasterName: order.cuttingMasterName ?? undefined,
          stitchingMasterName: order.stitchingMasterName ?? undefined,
        })),
      };
    });
  }

  /** Lightweight name/phone lookup for async customer pickers (no order history). */
  async lookup(tenantId: string, query: string) {
    const q = query.trim();
    const rows = await this.prisma.customer.findMany({
      where: {
        tenantId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
        ],
      },
      orderBy: [{ name: "asc" }, { phone: "asc" }],
      take: 30,
    });

    return rows.map((row) => this.toCustomer(row));
  }

  async findByPhone(tenantId: string, phone: string) {
    const normalized = requirePakistanPhone(phone);
    const row = await this.prisma.customer.findFirst({
      where: { tenantId, phone: normalized },
    });

    return row ? this.toCustomer(row) : null;
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
        },
        orders: {
          orderBy: { createdAt: "desc" },
          include: { createdBy: { select: { name: true } } },
        },
      },
    });

    if (!row) {
      throw new BadRequestException("Customer not found");
    }

    const latest = row.measurements[0];
    const savedMeasurements = this.latestMeasurementsByGarment(row.measurements);
    const lastOrderStyles = this.lastOrderStylesByGarment(row.orders);

    const orders = row.orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      garmentType: garmentKey(order.garmentType),
      garmentLabel: garmentLabel(order.garmentType),
      status: resolveDisplayStatus(order.status, order.deliveryDate),
      workflowStatus: orderStatusKey(order.status) as OrderWorkflowStatus,
      bookingDate: formatDueDate(order.bookingDate),
      deliveryDate: formatDueDate(order.deliveryDate),
      totalPrice: Number(order.totalPrice),
      advancePaid: Number(order.advancePaid),
      balanceDue: Number(order.balanceDue),
      bookedByName: order.createdBy?.name,
      cuttingMasterName: order.cuttingMasterName ?? undefined,
      stitchingMasterName: order.stitchingMasterName ?? undefined,
    }));

    const lifetimeValue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalPaid = orders.reduce(
      (sum, order) => sum + Math.max(0, order.totalPrice - order.balanceDue),
      0,
    );
    const outstandingBalance = orders
      .filter(
        (order) =>
          order.workflowStatus !== "delivered" &&
          order.workflowStatus !== "cancelled",
      )
      .reduce((sum, order) => sum + order.balanceDue, 0);

    return {
      customer: this.toCustomer(row),
      latestMeasurement: latest ? toMeasurementDto(latest) : null,
      savedMeasurements,
      lastOrderStyles,
      orders,
      summary: {
        totalOrders: orders.length,
        lifetimeValue,
        totalPaid,
        outstandingBalance,
      },
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
          ...(dto.isVip !== undefined ? { isVip: dto.isVip } : {}),
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
    const phone = requirePakistanPhone(dto.phone);
    const existingByPhone = await this.prisma.customer.findFirst({
      where: { tenantId, phone },
    });

    if (existingByPhone) {
      throw new BadRequestException(
        "A customer with this phone number already exists in your shop. Switch to Existing customer or use a different number.",
      );
    }

    try {
      const row = await this.prisma.customer.create({
        data: {
          tenantId,
          name: dto.name.trim(),
          phone,
          email: dto.email?.trim() || null,
          preferredLocale: toLocalePreference(dto.preferredLocale),
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
          "A customer with this phone number already exists in your shop. Switch to Existing customer or use a different number.",
        );
      }
      throw error;
    }
  }

  private async customerIdsWithMultipleOrders(tenantId: string): Promise<string[]> {
    const rows = await this.prisma.customer.findMany({
      where: { tenantId, orders: { some: {} } },
      select: { id: true, _count: { select: { orders: true } } },
    });

    return rows.filter((row) => row._count.orders > 1).map((row) => row.id);
  }

  private latestMeasurementsByGarment(
    rows: Parameters<typeof toMeasurementDto>[0][],
  ) {
    const byGarment = new Map<string, ReturnType<typeof toMeasurementDto>>();

    for (const row of rows) {
      const dto = toMeasurementDto(row);
      const key = dto.garmentType ?? "__unknown__";
      if (!byGarment.has(key)) {
        byGarment.set(key, dto);
      }
    }

    return Array.from(byGarment.values());
  }

  private lastOrderStylesByGarment(
    orders: Array<{
      orderNumber: string;
      garmentType: Parameters<typeof garmentKey>[0];
      bookingDate: Date;
      styleData: unknown;
      chestPocket: Parameters<typeof fromPocketOption>[0];
      sidePockets: Parameters<typeof fromPocketOption>[0];
      collar: Parameters<typeof fromCollarType>[0];
      placket: Parameters<typeof fromPlacketType>[0];
      gera: string | null;
      styleNotes: string | null;
    }>,
  ): CustomerGarmentStyleProfile[] {
    const byGarment = new Map<string, CustomerGarmentStyleProfile>();

    for (const order of orders) {
      const gKey = garmentKey(order.garmentType);
      if (byGarment.has(gKey)) continue;

      const style = this.styleFromOrder(order);
      if (!this.hasStyleValues(style)) continue;

      byGarment.set(gKey, {
        garmentType: gKey,
        garmentLabel: garmentLabel(order.garmentType),
        style,
        orderNumber: order.orderNumber,
        orderDate: formatDueDate(order.bookingDate),
      });
    }

    return Array.from(byGarment.values());
  }

  private styleFromOrder(order: {
    styleData: unknown;
    chestPocket: Parameters<typeof fromPocketOption>[0];
    sidePockets: Parameters<typeof fromPocketOption>[0];
    collar: Parameters<typeof fromCollarType>[0];
    placket: Parameters<typeof fromPlacketType>[0];
    gera: string | null;
    styleNotes: string | null;
  }): StyleValues {
    const jsonStyle = normalizeStyleMap(order.styleData as Record<string, unknown>);
    if (Object.keys(jsonStyle).length > 0) {
      return jsonStyle;
    }

    return {
      chestPocket: fromPocketOption(order.chestPocket),
      sidePockets: fromPocketOption(order.sidePockets),
      collar: fromCollarType(order.collar),
      placket: fromPlacketType(order.placket),
      gera: order.gera ?? undefined,
      notes: order.styleNotes ?? undefined,
    };
  }

  private hasStyleValues(style: StyleValues): boolean {
    return Object.values(style).some(
      (value) => typeof value === "string" && value.trim().length > 0,
    );
  }

  private toCustomer(row: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    preferredLocale: "EN" | "UR";
    isVip?: boolean;
  }) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email ?? undefined,
      preferredLocale: row.preferredLocale === "UR" ? ("ur" as const) : ("en" as const),
      isVip: row.isVip ?? false,
    };
  }
}
