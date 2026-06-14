import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import type {
  AssignmentOrderItem,
  AssignmentsOverview,
  DashboardData,
  Order,
  OrderAuditEntry,
  OrderFullDetail,
  PaginatedList,
} from "@business-os/tailor";
import { DEFAULT_PAGE_SIZE } from "@business-os/tailor";
import type { UserRole } from "../../generated/prisma/client";
import { OrderStatus } from "../../generated/prisma/client";
import { PrismaService } from "../../core/database/prisma.service";
import { requirePakistanPhone } from "../../common/utils/pakistan-phone.util";
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
import {
  buildOrderListOrderBy,
  compareOrdersForWorkflowSort,
  usesWorkflowSort,
} from "./order-list-sort";
import { buildNeedsAttentionList } from "./needs-attention.helper";
import {
  buildDashboardCash,
  buildDashboardDueWeekChart,
  buildDashboardGarmentMix,
  buildDashboardTailorWorkload,
  buildDashboardWorkload,
  buildReadyForPickupList,
  dashboardDueWeekRange,
  dashboardMonthRanges,
} from "./dashboard-summary.helper";
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const inProgressStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CUTTING,
      OrderStatus.STITCHING,
    ];
    const closedStatuses: OrderStatus[] = [
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ];

    const inProgressWhere = {
      tenantId,
      status: { in: inProgressStatuses },
    };

    const activeWhere = {
      tenantId,
      status: { notIn: closedStatuses },
    };

    const paymentDueWhere = {
      tenantId,
      status: OrderStatus.DELIVERED,
      balanceDue: { gt: 0 },
    };

    const { monthStart, prevMonthStart } = dashboardMonthRanges();
    const { start: dueWeekStart, end: dueWeekEnd } = dashboardDueWeekRange();
    const mixWindowStart = new Date(today);
    mixWindowStart.setDate(mixWindowStart.getDate() - 90);
    const activeAssignmentStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CUTTING,
      OrderStatus.STITCHING,
      OrderStatus.READY,
    ];
    const dueWeekWhere = {
      tenantId,
      status: { notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELLED] },
      deliveryDate: { gte: dueWeekStart, lte: dueWeekEnd },
    };

    const [
      totalOrders,
      inProgress,
      dueToday,
      ready,
      rush,
      overdue,
      paymentDue,
      dueThisWeek,
      booked,
      bookedToday,
      cutting,
      stitching,
      queueRows,
      dueSoonRows,
      rushPreview,
      overduePreview,
      dueTodayPreview,
      paymentDuePreview,
      collectedThisMonthAgg,
      collectedLastMonthAgg,
      deliveredThisMonth,
      outstandingAgg,
      recentPayments,
      dueWeekOrderRows,
      readyPickupRows,
      garmentMixRows,
      tailorWorkloadRows,
    ] = await Promise.all([
      this.prisma.order.count({ where: { tenantId } }),
      this.prisma.order.count({ where: inProgressWhere }),
      this.prisma.order.count({
        where: {
          ...activeWhere,
          deliveryDate: { gte: today, lt: tomorrow },
        },
      }),
      this.prisma.order.count({ where: { tenantId, status: OrderStatus.READY } }),
      this.prisma.order.count({
        where: { ...inProgressWhere, isRush: true },
      }),
      this.prisma.order.count({
        where: {
          ...inProgressWhere,
          deliveryDate: { lt: today },
        },
      }),
      this.prisma.order.count({ where: paymentDueWhere }),
      this.prisma.order.count({
        where: dueWeekWhere,
      }),
      this.prisma.order.count({
        where: { tenantId, status: OrderStatus.PENDING },
      }),
      this.prisma.order.count({
        where: {
          tenantId,
          bookingDate: { gte: today, lt: tomorrow },
        },
      }),
      this.prisma.order.count({
        where: { tenantId, status: OrderStatus.CUTTING },
      }),
      this.prisma.order.count({
        where: { tenantId, status: OrderStatus.STITCHING },
      }),
      this.prisma.order.findMany({
        where: inProgressWhere,
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        take: DEFAULT_PAGE_SIZE,
      }),
      this.prisma.order.findMany({
        where: {
          ...activeWhere,
          deliveryDate: { gte: today, lte: weekEnd },
        },
        include: { customer: true },
        orderBy: { deliveryDate: "asc" },
        take: 6,
      }),
      this.prisma.order.findMany({
        where: { ...inProgressWhere, isRush: true },
        include: { customer: true },
        orderBy: { deliveryDate: "asc" },
        take: 6,
      }),
      this.prisma.order.findMany({
        where: {
          ...inProgressWhere,
          deliveryDate: { lt: today },
        },
        include: { customer: true },
        orderBy: { deliveryDate: "asc" },
        take: 6,
      }),
      this.prisma.order.findMany({
        where: {
          ...activeWhere,
          deliveryDate: { gte: today, lt: tomorrow },
        },
        include: { customer: true },
        orderBy: { deliveryDate: "asc" },
        take: 6,
      }),
      this.prisma.order.findMany({
        where: paymentDueWhere,
        include: { customer: true },
        orderBy: { deliveryDate: "desc" },
        take: 6,
      }),
      this.prisma.orderPayment.aggregate({
        where: { tenantId, createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      this.prisma.orderPayment.aggregate({
        where: {
          tenantId,
          createdAt: { gte: prevMonthStart, lt: monthStart },
        },
        _sum: { amount: true },
      }),
      this.prisma.order.count({
        where: {
          tenantId,
          status: OrderStatus.DELIVERED,
          updatedAt: { gte: monthStart },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          tenantId,
          balanceDue: { gt: 0 },
          status: { notIn: [OrderStatus.CANCELLED] },
        },
        _sum: { balanceDue: true },
      }),
      this.prisma.orderPayment.findMany({
        where: { tenantId, createdAt: { gte: monthStart } },
        select: { amount: true, createdAt: true },
      }),
      this.prisma.order.findMany({
        where: dueWeekWhere,
        select: { deliveryDate: true },
      }),
      this.prisma.order.findMany({
        where: { tenantId, status: OrderStatus.READY },
        include: { customer: true },
        orderBy: { updatedAt: "asc" },
        take: 4,
      }),
      this.prisma.order.findMany({
        where: {
          tenantId,
          status: { not: OrderStatus.CANCELLED },
          createdAt: { gte: mixWindowStart },
        },
        select: { garmentType: true },
      }),
      this.prisma.order.findMany({
        where: {
          tenantId,
          status: { in: activeAssignmentStatuses },
        },
        select: { assignedToName: true },
      }),
    ]);

    const needsAttention = buildNeedsAttentionList({
      rush: { count: rush, preview: rushPreview },
      overdue: { count: overdue, preview: overduePreview },
      dueToday: { count: dueToday, preview: dueTodayPreview },
      paymentDue: { count: paymentDue, preview: paymentDuePreview },
    });

    const workload = buildDashboardWorkload({
      booked,
      bookedToday,
      cutting,
      stitching,
      ready,
    });

    const cash = buildDashboardCash({
      collectedThisMonth: Number(collectedThisMonthAgg._sum.amount ?? 0),
      collectedLastMonth: Number(collectedLastMonthAgg._sum.amount ?? 0),
      deliveredThisMonth,
      outstandingBalance: Number(outstandingAgg._sum.balanceDue ?? 0),
      recentPayments,
    });

    const dueWeekChart = buildDashboardDueWeekChart(
      dueWeekOrderRows,
      overdue,
    );

    const readyForPickup = buildReadyForPickupList(
      readyPickupRows,
      (type) => garmentLabel(toGarmentType(type)),
      customerInitials,
    );

    const garmentMix = buildDashboardGarmentMix(
      garmentMixRows,
      (type) => garmentLabel(toGarmentType(type)),
    );

    const workloadByTailor = buildDashboardTailorWorkload(tailorWorkloadRows);

    return {
      stats: {
        totalOrders,
        inProgress,
        dueToday,
        ready,
        rush,
        overdue,
        paymentDue,
        dueThisWeek,
      },
      needsAttention,
      readyForPickup,
      workload,
      cash,
      dueWeekChart,
      garmentMix,
      workloadByTailor,
      orders: queueRows.map((order) => this.toOrderDto(order)),
      dueSoonOrders: dueSoonRows.map((order) => this.toOrderDto(order)),
    };
  }

  async list(
    tenantId: string,
    query?: ListOrdersQueryDto,
  ): Promise<PaginatedList<Order>> {
    const limit = Math.min(query?.limit ?? DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE);
    const offset = query?.offset ?? 0;

    const where = buildOrderListWhere(
      tenantId,
      query?.filter,
      query?.customerId,
      query?.search,
      query?.assignedTo,
      query?.dueFrom,
      query?.dueTo,
    );

    if (usesWorkflowSort(query?.sort)) {
      const candidates = await this.prisma.order.findMany({
        where,
        select: {
          id: true,
          status: true,
          deliveryDate: true,
          isRush: true,
          createdAt: true,
        },
      });

      candidates.sort(compareOrdersForWorkflowSort);

      const window = candidates.slice(offset, offset + limit + 1);
      const hasMore = window.length > limit;
      const pageKeys = window.slice(0, limit);

      if (pageKeys.length === 0) {
        return { items: [], hasMore: false, nextOffset: null };
      }

      const orders = await this.prisma.order.findMany({
        where: { id: { in: pageKeys.map((row) => row.id) } },
        include: { customer: true },
      });
      const byId = new Map(orders.map((order) => [order.id, order]));
      const page = pageKeys
        .map((row) => byId.get(row.id))
        .filter((order): order is (typeof orders)[number] => Boolean(order));

      return {
        items: page.map((order) => this.toOrderDto(order)),
        hasMore,
        nextOffset: hasMore ? offset + limit : null,
      };
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: { customer: true },
      orderBy: buildOrderListOrderBy(query?.sort),
      take: limit + 1,
      skip: offset,
    });

    const hasMore = orders.length > limit;
    const page = orders.slice(0, limit);

    return {
      items: page.map((order) => this.toOrderDto(order)),
      hasMore,
      nextOffset: hasMore ? offset + limit : null,
    };
  }

  async listReceivables(tenantId: string) {
    const [receivables, received] = await Promise.all([
      this.listOutstandingReceivables(tenantId),
      this.listReceivedCollections(tenantId),
    ]);

    return { receivables, received };
  }

  private async listOutstandingReceivables(tenantId: string) {
    const monthStart = startOfMonth(new Date());

    const [orders, collectedAgg] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          tenantId,
          balanceDue: { gt: 0 },
          status: { notIn: ["CANCELLED"] },
        },
        include: { customer: true },
        orderBy: { deliveryDate: "asc" },
      }),
      this.prisma.orderPayment.aggregate({
        where: {
          tenantId,
          createdAt: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
    ]);

    const byCustomer = new Map<
      string,
      {
        customerId: string;
        customerName: string;
        customerPhone: string;
        orderCount: number;
        totalBalance: number;
        primaryOrderId: string;
      }
    >();

    for (const order of orders) {
      const balanceDue = Number(order.balanceDue);
      const existing = byCustomer.get(order.customerId);
      if (existing) {
        existing.orderCount += 1;
        existing.totalBalance += balanceDue;
      } else {
        byCustomer.set(order.customerId, {
          customerId: order.customerId,
          customerName: order.customer.name,
          customerPhone: order.customer.phone,
          orderCount: 1,
          totalBalance: balanceDue,
          primaryOrderId: order.id,
        });
      }
    }

    const customers = Array.from(byCustomer.values()).sort(
      (a, b) => b.totalBalance - a.totalBalance,
    );

    return {
      summary: {
        totalOutstanding: orders.reduce(
          (sum, order) => sum + Number(order.balanceDue),
          0,
        ),
        customersOwing: customers.length,
        collectedThisMonth: Number(collectedAgg._sum.amount ?? 0),
      },
      customers,
    };
  }

  private async listReceivedCollections(tenantId: string) {
    const monthStart = startOfMonth(new Date());

    const payments = await this.prisma.orderPayment.findMany({
      where: {
        tenantId,
        createdAt: { gte: monthStart },
      },
      include: {
        order: { include: { customer: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const byCustomer = new Map<
      string,
      {
        customerId: string;
        customerName: string;
        customerPhone: string;
        orderIds: Set<string>;
        totalReceived: number;
        primaryOrderId: string;
      }
    >();

    for (const payment of payments) {
      const customerId = payment.order.customerId;
      const amount = Number(payment.amount);
      const existing = byCustomer.get(customerId);

      if (existing) {
        existing.orderIds.add(payment.orderId);
        existing.totalReceived += amount;
      } else {
        byCustomer.set(customerId, {
          customerId,
          customerName: payment.order.customer.name,
          customerPhone: payment.order.customer.phone,
          orderIds: new Set([payment.orderId]),
          totalReceived: amount,
          primaryOrderId: payment.orderId,
        });
      }
    }

    const customers = Array.from(byCustomer.values())
      .map((row) => ({
        customerId: row.customerId,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        orderCount: row.orderIds.size,
        totalReceived: row.totalReceived,
        primaryOrderId: row.primaryOrderId,
      }))
      .sort((a, b) => b.totalReceived - a.totalReceived);

    const ordersPaid = new Set(payments.map((payment) => payment.orderId)).size;

    return {
      summary: {
        totalReceivedThisMonth: payments.reduce(
          (sum, payment) => sum + Number(payment.amount),
          0,
        ),
        customersPaid: customers.length,
        ordersPaid,
      },
      customers,
    };
  }

  async markCustomerBalancesPaid(
    tenantId: string,
    customerId: string,
    userId: string,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        customerId,
        balanceDue: { gt: 0 },
        status: { notIn: ["CANCELLED"] },
      },
    });

    if (orders.length === 0) {
      throw new BadRequestException("No outstanding balance for this customer");
    }

    for (const order of orders) {
      const totalPrice = Number(order.totalPrice);
      const payment = Number(order.balanceDue);
      if (payment <= 0) continue;

      await this.prisma.orderPayment.create({
        data: {
          tenantId,
          orderId: order.id,
          amount: payment,
          recordedByUserId: userId,
          note: "Balance collected from receivables",
        },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          advancePaid: totalPrice,
          balanceDue: 0,
        },
      });
    }

    return { clearedOrders: orders.length };
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

    if (
      dto.dressImageUrl &&
      dto.dressImageUrl.startsWith("data:") &&
      dto.dressImageUrl.length > 700_000
    ) {
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
        dressImagePublicId: dto.dressImagePublicId?.trim() || null,
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
      if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        throw new ForbiddenException("Only admin can restore cancelled orders");
      }
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
    userId?: string,
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

    const garmentType =
      dto.garmentType !== undefined
        ? toGarmentType(dto.garmentType)
        : order.garmentType;

    let measurementPatch: Record<string, unknown> = {};
    if (dto.measurements !== undefined) {
      const measurementsData = normalizeMeasurementMap(dto.measurements);
      const existingStyle =
        order.styleData && typeof order.styleData === "object"
          ? (order.styleData as Record<string, string>)
          : {};
      const styleData = normalizeStyleMap(dto.style ?? existingStyle);
      const legacy = legacyMeasurementColumns(measurementsData);

      measurementPatch = {
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
        chestPocket: toPocketOption(styleData.chestPocket),
        sidePockets: toPocketOption(styleData.sidePockets),
        collar: toCollarType(styleData.collar),
        placket: toPlacketType(styleData.placket),
        gera: styleData.gera?.trim() || null,
        styleNotes:
          styleData.notes?.trim() ||
          (dto.styleNotes !== undefined
            ? dto.styleNotes.trim() || null
            : undefined),
      };

      await this.syncOrderMeasurements(
        tenantId,
        order,
        garmentType,
        measurementsData,
        styleData,
        userId,
      );
    }

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
          dto.garmentType !== undefined ? garmentType : undefined,
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
        dressImagePublicId:
          dto.dressImagePublicId !== undefined
            ? dto.dressImagePublicId.trim() || null
            : dto.dressImageUrl !== undefined
              ? null
              : undefined,
        isRush: dto.isRush,
        assignedToName:
          dto.assignedToName !== undefined
            ? this.normalizeAssignedToName(dto.assignedToName)
            : undefined,
        ...measurementPatch,
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

  async getTenantName(tenantId: string): Promise<string> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    return tenant?.name ?? "shop";
  }

  async updateDressImage(
    orderId: string,
    dressImageUrl: string | null,
    dressImagePublicId: string | null,
  ) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { dressImageUrl, dressImagePublicId },
      include: { customer: true, tenant: true, measurement: true, payments: true },
    });
  }

  private async syncOrderMeasurements(
    tenantId: string,
    order: Awaited<ReturnType<OrderRepository["findFullById"]>>,
    garmentType: ReturnType<typeof toGarmentType>,
    measurementsData: ReturnType<typeof normalizeMeasurementMap>,
    styleData: ReturnType<typeof normalizeStyleMap>,
    userId?: string,
  ) {
    const legacy = legacyMeasurementColumns(measurementsData);
    const data = {
      garmentType,
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
      chestPocket: toPocketOption(styleData.chestPocket),
      sidePockets: toPocketOption(styleData.sidePockets),
      collar: toCollarType(styleData.collar),
      placket: toPlacketType(styleData.placket),
      gera: styleData.gera?.trim() || null,
      notes: styleData.notes?.trim() || null,
    };

    if (order.measurementId) {
      await this.prisma.measurement.update({
        where: { id: order.measurementId },
        data,
      });
    }

    const profileMeasurement = await this.prisma.measurement.findFirst({
      where: {
        tenantId,
        customerId: order.customerId,
        garmentType,
      },
      orderBy: { createdAt: "desc" },
    });

    if (
      profileMeasurement &&
      profileMeasurement.id !== order.measurementId
    ) {
      await this.prisma.measurement.update({
        where: { id: profileMeasurement.id },
        data,
      });
    } else if (!profileMeasurement && !order.measurementId && userId) {
      await this.prisma.measurement.create({
        data: {
          tenantId,
          customerId: order.customerId,
          takenByUserId: userId,
          unit: "INCHES",
          ...data,
        },
      });
    }
  }

  async getAssignmentsOverview(tenantId: string): Promise<AssignmentsOverview> {
    const activeStatuses = ["PENDING", "CUTTING", "STITCHING", "READY"] as const;

    const [activeOrders, unassignedOrders, unassignedAgg, staffUsers, distinctAssignees] =
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
        this.prisma.order.findMany({
          where: {
            tenantId,
            status: { in: [...activeStatuses] },
            assignedToName: null,
          },
          include: { customer: true },
          orderBy: { deliveryDate: "asc" },
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
      existing.orders.push(this.toAssignmentOrderItem(order, count));
      grouped.set(name, existing);
    }

    const assignments = assignees.map((name) => {
      const existing = grouped.get(name);
      if (existing) return existing;
      return {
        assignedToName: name,
        orderCount: 0,
        suitCount: 0,
        orders: [],
      };
    });

    for (const row of grouped.values()) {
      if (!assignees.includes(row.assignedToName)) {
        assignments.push(row);
      }
    }

    assignments.sort((a, b) => a.assignedToName.localeCompare(b.assignedToName));

    return {
      assignees,
      unassignedOrderCount: unassignedAgg._count._all ?? 0,
      unassignedSuitCount: unassignedAgg._sum.suitCount ?? 0,
      unassignedOrders: unassignedOrders.map((order) =>
        this.toAssignmentOrderItem(
          order,
          order.suitCount > 0 ? order.suitCount : 1,
        ),
      ),
      assignments,
    };
  }

  private toAssignmentOrderItem(
    order: {
      id: string;
      orderNumber: string;
      status: OrderStatus;
      isRush: boolean;
      garmentType: Parameters<typeof garmentLabel>[0];
      deliveryDate: Date;
      customer: { name: string };
    },
    suitCount: number,
  ): AssignmentOrderItem {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      suitCount,
      workflowStatus: orderStatusKey(
        order.status,
      ) as AssignmentOrderItem["workflowStatus"],
      dueDate: formatDueDate(order.deliveryDate),
      garmentLabel: garmentLabel(order.garmentType),
      isRush: order.isRush,
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
      dressImagePublicId: order.dressImagePublicId ?? undefined,
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

    const phone = requirePakistanPhone(dto.customerPhone);
    const existingByPhone = await this.prisma.customer.findFirst({
      where: { tenantId, phone },
    });

    if (existingByPhone) {
      throw new BadRequestException(
        "A customer with this phone number already exists. Switch to Existing customer or use a different number.",
      );
    }

    try {
      const customer = await this.prisma.customer.create({
        data: {
          tenantId,
          name: dto.customerName.trim(),
          phone,
          email: dto.customerEmail?.trim() || null,
          preferredLocale: toLocalePreference("en"),
        },
      });

      return customer.id;
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new BadRequestException(
          "A customer with this phone number already exists. Switch to Existing customer or use a different number.",
        );
      }
      throw error;
    }
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
    balanceDue: { toString(): string } | number;
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
      balanceDue: Number(order.balanceDue),
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

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
