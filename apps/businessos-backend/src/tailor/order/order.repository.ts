import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import type {
  AssignmentOrderItem,
  AssignmentsOverview,
  DashboardData,
  Order,
  OrderAuditEntry,
  OrderFullDetail,
} from "@business-os/tailor";
import type { UserRole } from "../../generated/prisma/client";
import { PrismaService } from "../../core/database/prisma.service";
import {
  customerInitials,
  formatDueDate,
  garmentKey,
  garmentLabel,
  orderStatusKey,
  parseDecimal,
  resolveDisplayStatus,
  toCollarType,
  toFabricSource,
  toGarmentType,
  toLocalePreference,
  toOrderStatus,
  toPlacketType,
  toPocketOption,
} from "../common/tailor.mapper";
import type { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import type { CreateOrderDto } from "./dto/create-order.dto";
import type { ListOrdersQueryDto } from "./dto/list-orders-query.dto";
import type { UpdateOrderDto } from "./dto/update-order.dto";
import { buildOrderListWhere } from "./order-list.helpers";
import { buildOrderListOrderBy } from "./order-list-sort";
import {
  legacyMeasurementColumns,
  normalizeMeasurementMap,
  normalizeStyleMap,
  styleFromFlatDto,
} from "../measurement/measurement-json.helper";
import { toMeasurementDto } from "../measurement/measurement.mapper";

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(tenantId: string): Promise<DashboardData> {
    const orders = await this.prisma.order.findMany({
      where: { tenantId },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const active = orders.filter(
      (order) => !["DELIVERED", "CANCELLED"].includes(order.status),
    );

    const stats = {
      totalOrders: orders.length,
      inProgress: active.filter((order) =>
        ["PENDING", "CUTTING", "STITCHING"].includes(order.status),
      ).length,
      dueToday: active.filter((order) => {
        const due = new Date(order.deliveryDate);
        due.setHours(0, 0, 0, 0);
        return due.getTime() === today.getTime();
      }).length,
      ready: orders.filter((order) => order.status === "READY").length,
    };

    return {
      stats,
      orders: orders.map((order) => this.toOrderDto(order)),
    };
  }

  async list(tenantId: string, query?: ListOrdersQueryDto): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: buildOrderListWhere(
        tenantId,
        query?.filter,
        query?.customerId,
        query?.search,
        query?.assignedTo,
        query?.dueFrom,
        query?.dueTo,
      ),
      include: { customer: true },
      orderBy: buildOrderListOrderBy(query?.sort),
    });

    return orders.map((order) => this.toOrderDto(order));
  }

  async listReceivables(tenantId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        balanceDue: { gt: 0 },
        status: { notIn: ["CANCELLED"] },
      },
      include: { customer: true },
      orderBy: { deliveryDate: "asc" },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      balanceDue: Number(order.balanceDue),
      workflowStatus: orderStatusKey(order.status),
      dueDate: formatDueDate(order.deliveryDate),
      garmentLabel: garmentLabel(order.garmentType),
    }));
  }

  async findFullById(tenantId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
      include: {
        customer: true,
        tenant: true,
        measurement: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      throw new BadRequestException("Order not found");
    }

    return order;
  }

  async findById(tenantId: string, orderId: string) {
    return this.findFullById(tenantId, orderId);
  }

  async markReady(tenantId: string, orderId: string) {
    const order = await this.findById(tenantId, orderId);

    if (["DELIVERED", "CANCELLED"].includes(order.status)) {
      throw new BadRequestException("This order cannot be marked as ready");
    }

    if (order.status === "READY") {
      return order;
    }

    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: "READY" },
      include: { customer: true, tenant: true },
    });
  }

  async updateNotificationTimestamps(
    orderId: string,
    data: { readyNotifiedAt?: Date; readyEmailSentAt?: Date },
  ) {
    return this.prisma.order.update({
      where: { id: orderId },
      data,
      include: { customer: true, tenant: true },
    });
  }

  async create(
    tenantId: string,
    userId: string,
    dto: CreateOrderDto,
  ) {
    const customerId = await this.resolveCustomerId(tenantId, dto);
    const orderNumber = await this.nextOrderNumber(tenantId);
    const totalPrice = parseDecimal(dto.totalPrice) ?? 0;
    const advancePaid = parseDecimal(dto.advancePaid) ?? 0;
    const balanceDue = Math.max(totalPrice - advancePaid, 0);
    const suitCount = Math.max(1, Math.floor(parseDecimal(dto.suitCount) ?? 1));

    if (dto.dressImageUrl && dto.dressImageUrl.length > 700_000) {
      throw new BadRequestException("Dress image is too large");
    }

    const garmentType = toGarmentType(dto.garmentType);
    const measurementsData = normalizeMeasurementMap(dto.measurements);
    const styleData = normalizeStyleMap(styleFromFlatDto(dto));
    const legacy = legacyMeasurementColumns(measurementsData);

    const measurement = await this.prisma.measurement.create({
      data: {
        tenantId,
        customerId,
        takenByUserId: userId,
        garmentType,
        unit: "INCHES",
        measurementsData,
        styleData,
        chest: legacy.chest,
        waist: legacy.waist,
        shoulder: legacy.shoulder,
        sleeve: legacy.sleeve,
        neck: legacy.neck,
        shirtLength: legacy.shirtLength,
        trouserLength: legacy.trouserLength,
        hip: legacy.hip,
        thigh: legacy.thigh,
        chestPocket: toPocketOption(styleData.chestPocket ?? dto.chestPocket),
        sidePockets: toPocketOption(styleData.sidePockets ?? dto.sidePockets),
        collar: toCollarType(styleData.collar ?? dto.collar),
        placket: toPlacketType(styleData.placket ?? dto.placket),
        gera: styleData.gera?.trim() || dto.gera?.trim() || null,
        notes: styleData.notes?.trim() || dto.styleNotes?.trim() || null,
      },
    });

    const order = await this.prisma.order.create({
      data: {
        tenantId,
        customerId,
        createdByUserId: userId,
        measurementId: measurement.id,
        orderNumber,
        garmentType,
        dressCode: dto.dressCode?.trim() || null,
        suitCount,
        dressImageUrl: dto.dressImageUrl?.trim() || null,
        bookingDate: new Date(dto.bookingDate),
        deliveryDate: new Date(dto.deliveryDate),
        measurementsData,
        styleData,
        fabricSource: toFabricSource(dto.fabricSource),
        fabricNotes: dto.fabricNotes?.trim() || null,
        chestPocket: toPocketOption(styleData.chestPocket ?? dto.chestPocket),
        sidePockets: toPocketOption(styleData.sidePockets ?? dto.sidePockets),
        collar: toCollarType(styleData.collar ?? dto.collar),
        placket: toPlacketType(styleData.placket ?? dto.placket),
        gera: styleData.gera?.trim() || dto.gera?.trim() || null,
        styleNotes: styleData.notes?.trim() || dto.styleNotes?.trim() || null,
        advancePaid,
        totalPrice,
        balanceDue,
        isRush: dto.isRush === true,
        assignedToName: this.normalizeAssignedToName(dto.assignedToName),
      },
      include: { customer: true },
    });

    return this.toOrderDto(order);
  }

  async updateStatus(
    tenantId: string,
    orderId: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.findById(tenantId, orderId);
    const nextStatus = toOrderStatus(dto.status);
    const adminOnly: Array<typeof nextStatus> = ["DELIVERED", "CANCELLED"];

    if (
      adminOnly.includes(nextStatus) &&
      userRole !== "ADMIN" &&
      userRole !== "SUPER_ADMIN"
    ) {
      throw new ForbiddenException("Only admin can mark orders as delivered");
    }

    if (order.status === "CANCELLED" && nextStatus !== "CANCELLED") {
      throw new BadRequestException("Cancelled orders cannot be updated");
    }

    if (order.status === "DELIVERED" && nextStatus !== "DELIVERED") {
      if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        throw new BadRequestException("Delivered orders cannot be changed");
      }
    }

    let advancePaid = Number(order.advancePaid);
    let balanceDue = Number(order.balanceDue);

    if (nextStatus === "DELIVERED" && dto.paymentCollected) {
      const payment = parseDecimal(dto.paymentCollected) ?? 0;
      if (payment > 0) {
        advancePaid += payment;
        balanceDue = Math.max(Number(order.totalPrice) - advancePaid, 0);
        await this.prisma.orderPayment.create({
          data: {
            tenantId,
            orderId: order.id,
            amount: payment,
            recordedByUserId: userId,
            note: dto.paymentNote?.trim() || null,
          },
        });
      }
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        advancePaid,
        balanceDue,
      },
      include: { customer: true },
    });

    return {
      order: this.toOrderDto(updated),
      paymentRecorded: dto.paymentCollected
        ? parseDecimal(dto.paymentCollected) ?? 0
        : 0,
      previousStatus: orderStatusKey(order.status),
      nextStatus: dto.status,
    };
  }

  async updateOrder(
    tenantId: string,
    orderId: string,
    dto: UpdateOrderDto,
  ) {
    const order = await this.findById(tenantId, orderId);

    if (["DELIVERED", "CANCELLED"].includes(order.status)) {
      throw new BadRequestException("This order cannot be edited");
    }

    const totalPrice =
      dto.totalPrice !== undefined
        ? (parseDecimal(dto.totalPrice) ?? Number(order.totalPrice))
        : Number(order.totalPrice);
    const advancePaid =
      dto.advancePaid !== undefined
        ? (parseDecimal(dto.advancePaid) ?? Number(order.advancePaid))
        : Number(order.advancePaid);
    const balanceDue = Math.max(totalPrice - advancePaid, 0);

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        deliveryDate: dto.deliveryDate
          ? new Date(dto.deliveryDate)
          : undefined,
        totalPrice,
        advancePaid,
        balanceDue,
        dressCode: dto.dressCode !== undefined ? dto.dressCode.trim() || null : undefined,
        suitCount:
          dto.suitCount !== undefined
            ? Math.max(1, Math.floor(parseDecimal(dto.suitCount) ?? 1))
            : undefined,
        garmentType:
          dto.garmentType !== undefined
            ? toGarmentType(dto.garmentType)
            : undefined,
        fabricSource:
          dto.fabricSource !== undefined
            ? toFabricSource(dto.fabricSource)
            : undefined,
        fabricNotes:
          dto.fabricNotes !== undefined
            ? dto.fabricNotes.trim() || null
            : undefined,
        styleNotes:
          dto.styleNotes !== undefined
            ? dto.styleNotes.trim() || null
            : undefined,
        dressImageUrl:
          dto.dressImageUrl !== undefined
            ? dto.dressImageUrl.trim() || null
            : undefined,
        isRush: dto.isRush,
        assignedToName:
          dto.assignedToName !== undefined
            ? this.normalizeAssignedToName(dto.assignedToName)
            : undefined,
      },
      include: {
        customer: true,
        tenant: true,
        measurement: true,
        payments: true,
      },
    });

    return updated;
  }

  async getAssignmentsOverview(tenantId: string): Promise<AssignmentsOverview> {
    const activeStatuses = ["PENDING", "CUTTING", "STITCHING", "READY"] as const;

    const [activeOrders, unassignedAgg, staffUsers, distinctAssignees] =
      await Promise.all([
        this.prisma.order.findMany({
          where: {
            tenantId,
            status: { in: [...activeStatuses] },
            assignedToName: { not: null },
          },
          include: { customer: true },
          orderBy: [{ assignedToName: "asc" }, { deliveryDate: "asc" }],
        }),
        this.prisma.order.aggregate({
          where: {
            tenantId,
            status: { in: [...activeStatuses] },
            assignedToName: null,
          },
          _count: { _all: true },
          _sum: { suitCount: true },
        }),
        this.prisma.user.findMany({
          where: { tenantId },
          select: { name: true },
          orderBy: { name: "asc" },
        }),
        this.prisma.order.findMany({
          where: { tenantId, assignedToName: { not: null } },
          select: { assignedToName: true },
          distinct: ["assignedToName"],
        }),
      ]);

    const assignees = [
      ...new Set([
        ...staffUsers.map((u) => u.name),
        ...distinctAssignees
          .map((row) => row.assignedToName)
          .filter((name): name is string => Boolean(name?.trim())),
      ]),
    ].sort((a, b) => a.localeCompare(b));

    const grouped = new Map<
      string,
      AssignmentsOverview["assignments"][number]
    >();

    for (const order of activeOrders) {
      const name = order.assignedToName?.trim();
      if (!name) continue;

      const count = order.suitCount > 0 ? order.suitCount : 1;
      const existing = grouped.get(name) ?? {
        assignedToName: name,
        orderCount: 0,
        suitCount: 0,
        orders: [],
      };

      existing.orderCount += 1;
      existing.suitCount += count;
      existing.orders.push({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        suitCount: count,
        workflowStatus: orderStatusKey(order.status) as AssignmentOrderItem["workflowStatus"],
        dueDate: formatDueDate(order.deliveryDate),
        garmentLabel: garmentLabel(order.garmentType),
      });
      grouped.set(name, existing);
    }

    return {
      assignees,
      unassignedOrderCount: unassignedAgg._count._all ?? 0,
      unassignedSuitCount: unassignedAgg._sum.suitCount ?? 0,
      assignments: [...grouped.values()].sort((a, b) =>
        a.assignedToName.localeCompare(b.assignedToName),
      ),
    };
  }

  private normalizeAssignedToName(value?: string | null): string | null {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    return trimmed.slice(0, 120);
  }

  async getPaymentsWithUsers(tenantId: string, orderId: string) {
    const payments = await this.prisma.orderPayment.findMany({
      where: { tenantId, orderId },
      orderBy: { createdAt: "desc" },
    });
    const userIds = [...new Set(payments.map((p) => p.recordedByUserId))];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const nameById = new Map(users.map((u) => [u.id, u.name]));
    return payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      note: p.note ?? undefined,
      recordedByName: nameById.get(p.recordedByUserId) ?? "Staff",
      createdAt: p.createdAt.toISOString(),
    }));
  }

  toOrderFullDetail(
    order: Awaited<ReturnType<OrderRepository["findFullById"]>>,
    auditLog: Array<{
      id: string;
      action: string;
      details: Record<string, unknown>;
      userName: string;
      createdAt: string;
    }>,
    payments: Array<{
      id: string;
      amount: number;
      note?: string;
      recordedByName: string;
      createdAt: string;
    }>,
  ): OrderFullDetail {
    const base = this.toOrderDto(order);
    const measurement = order.measurement
      ? toMeasurementDto(order.measurement)
      : {
          measurements: {},
          style: {},
        };
    const fabricSource: OrderFullDetail["fabricSource"] =
      order.fabricSource === "SHOP" ? "shop" : "customer";

    return {
      ...base,
      customerId: order.customer.id,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email ?? undefined,
      garmentLabel: garmentLabel(order.garmentType),
      garmentType: garmentKey(order.garmentType),
      dressCode: order.dressCode ?? undefined,
      suitCount: order.suitCount,
      dressImageUrl: order.dressImageUrl ?? undefined,
      bookingDate: order.bookingDate.toISOString().slice(0, 10),
      deliveryDate: order.deliveryDate.toISOString().slice(0, 10),
      fabricSource,
      fabricNotes: order.fabricNotes ?? undefined,
      styleNotes: order.styleNotes ?? undefined,
      measurements: measurement.measurements,
      style: measurement.style,
      advancePaid: Number(order.advancePaid),
      totalPrice: Number(order.totalPrice),
      balanceDue: Number(order.balanceDue),
      isRush: order.isRush,
      assignedToName: order.assignedToName ?? undefined,
      canMarkReady: !["DELIVERED", "CANCELLED"].includes(order.status),
      readyNotifiedAt: order.readyNotifiedAt?.toISOString(),
      payments,
      auditLog: auditLog as OrderAuditEntry[],
    };
  }

  private async resolveCustomerId(tenantId: string, dto: CreateOrderDto) {
    if (dto.customerMode === "existing") {
      if (!dto.customerId) {
        throw new BadRequestException("customerId is required");
      }

      const existing = await this.prisma.customer.findFirst({
        where: { id: dto.customerId, tenantId },
      });
      if (!existing) {
        throw new BadRequestException("Customer not found");
      }
      return existing.id;
    }

    if (!dto.customerName?.trim() || !dto.customerPhone?.trim()) {
      throw new BadRequestException("Customer name and phone are required");
    }

    const customer = await this.prisma.customer.create({
      data: {
        tenantId,
        name: dto.customerName.trim(),
        phone: dto.customerPhone.trim(),
        email: dto.customerEmail?.trim() || null,
        preferredLocale: toLocalePreference("en"),
      },
    });

    return customer.id;
  }

  private async nextOrderNumber(tenantId: string) {
    const count = await this.prisma.order.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    return `ORD-${year}-${String(count + 1).padStart(4, "0")}`;
  }

  toOrderDto(order: {
    id: string;
    orderNumber: string;
    garmentType: Parameters<typeof garmentLabel>[0];
    suitCount: number;
    dressCode: string | null;
    assignedToName?: string | null;
    bookingDate: Date;
    status: Parameters<typeof resolveDisplayStatus>[0];
    deliveryDate: Date;
    isRush: boolean;
    customer: { name: string; phone: string };
  }): Order {
    const count = order.suitCount > 0 ? order.suitCount : 1;
    const label = garmentLabel(order.garmentType);
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerInitials: customerInitials(order.customer.name),
      customerPhone: order.customer.phone,
      items: `${count} x ${label}`,
      suitCount: count,
      garmentLabel: label,
      dressCode: order.dressCode ?? undefined,
      bookingDate: formatDueDate(order.bookingDate),
      workflowStatus: orderStatusKey(order.status) as Order["workflowStatus"],
      status: resolveDisplayStatus(order.status, order.deliveryDate),
      dueDate: formatDueDate(order.deliveryDate),
      isRush: order.isRush,
      assignedToName: order.assignedToName ?? undefined,
    };
  }

  toOrderDetail(order: {
    id: string;
    orderNumber: string;
    garmentType: Parameters<typeof garmentLabel>[0];
    suitCount: number;
    dressCode: string | null;
    bookingDate: Date;
    status: Parameters<typeof resolveDisplayStatus>[0];
    deliveryDate: Date;
    isRush: boolean;
    balanceDue: { toString(): string } | number;
    customer: {
      id: string;
      name: string;
      phone: string;
      email: string | null;
      preferredLocale: "EN" | "UR";
    };
  }) {
    const base = this.toOrderDto(order);
    return {
      ...base,
      customerId: order.customer.id,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email ?? undefined,
      garmentLabel: garmentLabel(order.garmentType),
      garmentType: garmentKey(order.garmentType),
      balanceDue: Number(order.balanceDue),
      canMarkReady: !["DELIVERED", "CANCELLED"].includes(
        order.status as string,
      ),
    };
  }
}
