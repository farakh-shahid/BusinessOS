import { Injectable } from "@nestjs/common";
import type { DailyAnalyticsPoint, TailorAnalytics } from "@business-os/tailor";
import { PrismaService } from "../../core/database/prisma.service";
import { garmentKey, garmentLabel } from "../common/tailor.mapper";
import type { AnalyticsQueryDto } from "./dto/analytics-query.dto";

type OrderRow = {
  status: string;
  garmentType: Parameters<typeof garmentLabel>[0];
  totalPrice: { toString(): string };
  advancePaid: { toString(): string };
  balanceDue: { toString(): string };
  createdAt: Date;
  deliveryDate: Date;
  assignedToName: string | null;
  customerId: string;
  customer: { name: string };
};

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(
    tenantId: string,
    query: AnalyticsQueryDto,
  ): Promise<TailorAnalytics> {
    const viewMode = query.view ?? "week";
    const anchor = parseAnchor(query.anchor);
    const now = new Date();

    const [tenant, orders, customerCount] = await Promise.all([
      this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } }),
      this.prisma.order.findMany({
        where: { tenantId },
        select: {
          status: true,
          garmentType: true,
          totalPrice: true,
          advancePaid: true,
          balanceDue: true,
          createdAt: true,
          deliveryDate: true,
          assignedToName: true,
          customerId: true,
          customer: { select: { name: true } },
        },
      }),
      this.prisma.customer.count({ where: { tenantId } }),
    ]);

    const tenantCreatedAt = startOfDay(tenant.createdAt);
    const { rangeStart, rangeEnd } = resolveRange(viewMode, anchor, now);
    const clampedStart =
      rangeStart < tenantCreatedAt ? tenantCreatedAt : rangeStart;

    const previousRange = previousPeriodRange(
      viewMode,
      clampedStart,
      rangeEnd,
      tenantCreatedAt,
    );

    const periodOrders = orders.filter((o) =>
      isInRange(o.createdAt, clampedStart, rangeEnd),
    );

    const focusRange = query.focus
      ? resolveFocusRange(
          viewMode,
          parseAnchor(query.focus),
          tenantCreatedAt,
          now,
        )
      : null;

    const metricsOrders = focusRange
      ? orders.filter((o) =>
          isInRange(o.createdAt, focusRange.start, focusRange.end),
        )
      : periodOrders;

    const comparisonRange = focusRange
      ? previousFocusRange(viewMode, focusRange, tenantCreatedAt)
      : previousRange;

    const previousOrders = comparisonRange
      ? orders.filter((o) =>
          isInRange(o.createdAt, comparisonRange.start, comparisonRange.end),
        )
      : [];

    const selectedPeriod = aggregateOrders(metricsOrders);
    const previousPeriod = aggregateOrders(previousOrders);

    const dailyBreakdown = buildDailyBreakdown(
      orders,
      viewMode,
      clampedStart,
      rangeEnd,
      tenantCreatedAt,
      now,
    );

    const outstandingBalance = orders
      .filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status))
      .reduce((sum, o) => sum + Number(o.balanceDue), 0);

    const deliveredInPeriod = metricsOrders.filter(
      (o) => o.status === "DELIVERED",
    ).length;
    const completionRate =
      metricsOrders.length > 0
        ? Math.round((deliveredInPeriod / metricsOrders.length) * 100)
        : 0;

    const canGoPrevious =
      viewMode === "week"
        ? addDays(startOfWeek(clampedStart), -7) >= startOfDay(tenantCreatedAt)
        : startOfMonth(addMonths(clampedStart, -1)) >=
          startOfMonth(tenantCreatedAt);

    const canGoNext =
      viewMode === "week"
        ? addDays(startOfWeek(clampedStart), 7) <= startOfWeek(now)
        : startOfMonth(addMonths(clampedStart, 1)) <= startOfMonth(now);

    const garmentBreakdown = garmentAnalytics(metricsOrders);
    const topGarments = garmentBreakdown.slice(0, 5);
    const monthlyTrend = buildMonthlyTrend(orders, now);
    const yearlyTrend = buildYearlyTrend(orders, now);
    const currentMonthRange = resolveRange("month", now, now);
    const currentMonthOrders = orders.filter((o) =>
      isInRange(o.createdAt, currentMonthRange.rangeStart, currentMonthRange.rangeEnd),
    );
    const previousMonthStart = startOfMonth(addMonths(now, -1));
    const previousMonthEnd = endOfMonth(previousMonthStart);
    const previousMonthOrders = orders.filter((o) =>
      isInRange(o.createdAt, previousMonthStart, previousMonthEnd),
    );
    const currentMonth = aggregateOrders(currentMonthOrders);
    const previousMonth = aggregateOrders(previousMonthOrders);
    const activeOrders = orders.filter(
      (o) => !["DELIVERED", "CANCELLED"].includes(o.status),
    );
    const receivables = buildReceivablesSnapshot(activeOrders);
    const productionPipeline = buildProductionPipeline(activeOrders);
    const busiestDays = buildBusiestDays(metricsOrders);
    const karigarOutput = buildKarigarOutput(metricsOrders);
    const topCustomers = buildTopCustomers(metricsOrders);
    const advanceCollectionRate =
      selectedPeriod.revenue > 0
        ? Math.round((selectedPeriod.advanceCollected / selectedPeriod.revenue) * 100)
        : 0;

    return {
      shopName: tenant.name,
      tenantCreatedAt: tenantCreatedAt.toISOString(),
      generatedAt: now.toISOString(),
      viewMode,
      rangeStart: clampedStart.toISOString(),
      rangeEnd: rangeEnd.toISOString(),
      rangeLabel: formatRangeLabel(clampedStart, rangeEnd, viewMode),
      focusDate: focusRange
        ? focusRange.start.toISOString().slice(0, 10)
        : undefined,
      focusLabel: focusRange
        ? formatFocusLabel(focusRange.start, focusRange.end, viewMode)
        : undefined,
      canGoPrevious,
      canGoNext,
      selectedPeriod,
      previousPeriod,
      periodComparison: {
        ordersChangePercent: percentChange(
          previousPeriod.orders,
          selectedPeriod.orders,
        ),
        revenueChangePercent: percentChange(
          previousPeriod.revenue,
          selectedPeriod.revenue,
        ),
      },
      outstandingBalance,
      totalCustomers: customerCount,
      statusBreakdown: countByStatus(metricsOrders),
      topGarments,
      garmentBreakdown,
      dailyBreakdown,
      monthlyTrend,
      workflowSnapshot: workflowSnapshot(metricsOrders),
      comparisonPeriodLabel:
        viewMode === "week" ? "Last week" : "Last month",
      currentPeriodLabel:
        viewMode === "week" ? "This week" : "This month",
      avgOrderValue:
        selectedPeriod.orders > 0
          ? selectedPeriod.revenue / selectedPeriod.orders
          : 0,
      completionRate,
      currentMonth,
      currentMonthComparison: {
        revenueChangePercent: percentChange(
          previousMonth.revenue,
          currentMonth.revenue,
        ),
      },
      yearlyTrend,
      receivablesAging: receivables.aging,
      receivablesCustomersOwing: receivables.customersOwing,
      topDebtors: receivables.topDebtors,
      productionPipeline,
      busiestDays,
      karigarOutput,
      topCustomers,
      advanceCollectionRate,
    };
  }
}

function parseAnchor(anchor?: string): Date {
  if (!anchor) return startOfDay(new Date());
  const parsed = new Date(anchor);
  return Number.isNaN(parsed.getTime()) ? startOfDay(new Date()) : startOfDay(parsed);
}

function resolveRange(viewMode: "week" | "month", anchor: Date, now: Date) {
  if (viewMode === "month") {
    const monthStart = startOfMonth(anchor);
    const monthEnd = endOfMonth(anchor);
    const end = monthEnd > now ? endOfDay(now) : monthEnd;
    return { rangeStart: monthStart, rangeEnd: end };
  }

  const weekStart = startOfWeek(anchor);
  const weekEnd = endOfDay(addDays(weekStart, 6));
  const end = weekEnd > now ? endOfDay(now) : weekEnd;
  return { rangeStart: weekStart, rangeEnd: end };
}

function previousPeriodRange(
  viewMode: "week" | "month",
  rangeStart: Date,
  rangeEnd: Date,
  tenantCreatedAt: Date,
) {
  if (viewMode === "week") {
    const prevStart = addDays(startOfWeek(rangeStart), -7);
    if (prevStart < tenantCreatedAt) return null;
    return {
      start: prevStart,
      end: endOfDay(addDays(prevStart, 6)),
    };
  }

  const prevMonthStart = startOfMonth(addMonths(rangeStart, -1));
  if (prevMonthStart < startOfMonth(tenantCreatedAt)) return null;
  return {
    start: prevMonthStart,
    end: endOfMonth(prevMonthStart),
  };
}

function buildDailyBreakdown(
  orders: OrderRow[],
  viewMode: "week" | "month",
  rangeStart: Date,
  rangeEnd: Date,
  tenantCreatedAt: Date,
  now: Date,
): DailyAnalyticsPoint[] {
  if (viewMode === "week") {
    const weekStart = startOfWeek(rangeStart);
    const points: DailyAnalyticsPoint[] = [];

    for (let i = 0; i < 7; i += 1) {
      const day = addDays(weekStart, i);
      const dayEnd = endOfDay(day);
      const disabled = day < tenantCreatedAt || day > now;
      const dayOrders = disabled
        ? []
        : orders.filter((o) => isInRange(o.createdAt, day, dayEnd));

      points.push({
        date: day.toISOString().slice(0, 10),
        dayLabel: day.toLocaleDateString("en-US", { weekday: "short" }),
        dateLabel: String(day.getDate()),
        orders: dayOrders.length,
        revenue: sumField(dayOrders, "totalPrice"),
        disabled,
      });
    }

    return points;
  }

  const points: DailyAnalyticsPoint[] = [];
  let cursor = startOfMonth(rangeStart);
  const monthEnd = endOfMonth(rangeStart);

  while (cursor <= monthEnd) {
    const weekStart = cursor;
    const weekEnd = endOfDay(
      addDays(weekStart, Math.min(6, daysBetween(weekStart, monthEnd))),
    );
    const cappedEnd = weekEnd > now ? endOfDay(now) : weekEnd;
    const disabled = weekStart < tenantCreatedAt || weekStart > now;

    const weekOrders = disabled
      ? []
      : orders.filter((o) =>
          isInRange(
            o.createdAt,
            weekStart < tenantCreatedAt ? tenantCreatedAt : weekStart,
            cappedEnd,
          ),
        );

    points.push({
      date: weekStart.toISOString().slice(0, 10),
      dayLabel: `W${points.length + 1}`,
      dateLabel: `${weekStart.getDate()}–${cappedEnd.getDate()}`,
      orders: weekOrders.length,
      revenue: sumField(weekOrders, "totalPrice"),
      disabled,
    });

    cursor = addDays(weekEnd, 1);
    if (cursor > monthEnd) break;
  }

  return points;
}

function resolveFocusRange(
  viewMode: "week" | "month",
  focus: Date,
  tenantCreatedAt: Date,
  now: Date,
): { start: Date; end: Date } | null {
  const focusDay = startOfDay(focus);
  if (focusDay > now || focusDay < tenantCreatedAt) return null;

  if (viewMode === "week") {
    return { start: focusDay, end: endOfDay(focusDay) };
  }

  const weekStart = startOfWeek(focusDay);
  let weekEnd = endOfDay(addDays(weekStart, 6));
  if (weekEnd > now) weekEnd = endOfDay(now);

  const start = weekStart < tenantCreatedAt ? tenantCreatedAt : weekStart;
  if (start > now) return null;

  return { start, end: weekEnd };
}

function previousFocusRange(
  viewMode: "week" | "month",
  focusRange: { start: Date; end: Date },
  tenantCreatedAt: Date,
): { start: Date; end: Date } | null {
  if (viewMode === "week") {
    const prevStart = addDays(startOfDay(focusRange.start), -1);
    if (prevStart < tenantCreatedAt) return null;
    return { start: prevStart, end: endOfDay(prevStart) };
  }

  const prevWeekStart = addDays(startOfWeek(focusRange.start), -7);
  if (prevWeekStart < startOfDay(tenantCreatedAt)) return null;
  return {
    start: prevWeekStart,
    end: endOfDay(addDays(prevWeekStart, 6)),
  };
}

function formatFocusLabel(
  start: Date,
  end: Date,
  viewMode: "week" | "month",
) {
  if (viewMode === "week") {
    return start.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  const sameMonth = start.getMonth() === end.getMonth();
  const startPart = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endPart = end.toLocaleDateString("en-US", {
    month: sameMonth ? undefined : "short",
    day: "numeric",
  });
  return `${startPart} – ${endPart}`;
}

function formatRangeLabel(start: Date, end: Date, viewMode: "week" | "month") {
  if (viewMode === "month") {
    return start.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const sameMonth = start.getMonth() === end.getMonth();
  const startPart = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const endPart = end.toLocaleDateString("en-US", {
    month: sameMonth ? undefined : "long",
    day: "numeric",
  });
  return `${startPart} – ${endPart}`;
}

function aggregateOrders(orders: OrderRow[]) {
  return {
    orders: orders.length,
    revenue: sumField(orders, "totalPrice"),
    advanceCollected: sumField(orders, "advancePaid"),
  };
}

function sumField(
  orders: OrderRow[],
  field: "totalPrice" | "advancePaid" | "balanceDue",
) {
  return orders.reduce((sum, o) => sum + Number(o[field]), 0);
}

function countByStatus(orders: OrderRow[]) {
  const counts = {
    pending: 0,
    inProgress: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  };

  for (const order of orders) {
    switch (order.status) {
      case "PENDING":
        counts.pending += 1;
        break;
      case "CUTTING":
      case "STITCHING":
        counts.inProgress += 1;
        break;
      case "READY":
        counts.ready += 1;
        break;
      case "DELIVERED":
        counts.delivered += 1;
        break;
      case "CANCELLED":
        counts.cancelled += 1;
        break;
    }
  }

  return counts;
}

function garmentAnalytics(orders: OrderRow[]) {
  const map = new Map<
    string,
    { garmentType: string; garmentLabel: string; count: number; revenue: number }
  >();

  for (const order of orders) {
    const key = garmentKey(order.garmentType);
    const label = garmentLabel(order.garmentType);
    const existing = map.get(key);

    if (existing) {
      existing.count += 1;
      existing.revenue += Number(order.totalPrice);
    } else {
      map.set(key, {
        garmentType: key,
        garmentLabel: label,
        count: 1,
        revenue: Number(order.totalPrice),
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

function workflowSnapshot(orders: OrderRow[]) {
  let inProgress = 0;
  let delivered = 0;

  for (const order of orders) {
    if (order.status === "DELIVERED") {
      delivered += 1;
    } else if (order.status !== "CANCELLED") {
      inProgress += 1;
    }
  }

  return { inProgress, delivered };
}

function buildMonthlyTrend(orders: OrderRow[], now: Date) {
  return buildMonthSeries(orders, now, 5);
}

function buildYearlyTrend(orders: OrderRow[], now: Date) {
  return buildMonthSeries(orders, now, 11);
}

function buildMonthSeries(orders: OrderRow[], now: Date, monthsBack: number) {
  const points: {
    month: string;
    monthLabel: string;
    orders: number;
    revenue: number;
  }[] = [];

  for (let i = monthsBack; i >= 0; i -= 1) {
    const monthStart = startOfMonth(addMonths(now, -i));
    const monthEnd = endOfMonth(monthStart);
    const cappedEnd = monthEnd > now ? endOfDay(now) : monthEnd;
    const monthOrders = orders.filter((o) =>
      isInRange(o.createdAt, monthStart, cappedEnd),
    );

    points.push({
      month: monthStart.toISOString().slice(0, 7),
      monthLabel: monthStart.toLocaleDateString("en-US", {
        month: "short",
      }),
      orders: monthOrders.length,
      revenue: sumField(monthOrders, "totalPrice"),
    });
  }

  return points;
}

function buildReceivablesSnapshot(orders: OrderRow[]) {
  const owing = orders.filter((o) => Number(o.balanceDue) > 0);
  const aging = {
    current: 0,
    late_1_2w: 0,
    late_2w_plus: 0,
  };
  const byCustomer = new Map<
    string,
    { customerName: string; balance: number; daysLate: number }
  >();
  const today = startOfDay(new Date());

  for (const order of owing) {
    const balance = Number(order.balanceDue);
    const due = startOfDay(order.deliveryDate);
    const daysLate = Math.max(
      0,
      Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)),
    );

    if (daysLate === 0) aging.current += balance;
    else if (daysLate <= 14) aging.late_1_2w += balance;
    else aging.late_2w_plus += balance;

    const existing = byCustomer.get(order.customerId);
    if (existing) {
      existing.balance += balance;
      existing.daysLate = Math.max(existing.daysLate, daysLate);
    } else {
      byCustomer.set(order.customerId, {
        customerName: order.customer.name,
        balance,
        daysLate,
      });
    }
  }

  return {
    aging: [
      { key: "current" as const, amount: aging.current },
      { key: "late_1_2w" as const, amount: aging.late_1_2w },
      { key: "late_2w_plus" as const, amount: aging.late_2w_plus },
    ],
    customersOwing: byCustomer.size,
    topDebtors: Array.from(byCustomer.entries())
      .sort((a, b) => b[1].balance - a[1].balance)
      .slice(0, 5)
      .map(([customerId, row]) => ({
        customerId,
        customerName: row.customerName,
        balance: row.balance,
        daysLate: row.daysLate,
      })),
  };
}

function buildProductionPipeline(orders: OrderRow[]) {
  return {
    orderCount: orders.length,
    totalValue: sumField(orders, "totalPrice"),
  };
}

function buildBusiestDays(orders: OrderRow[]) {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const order of orders) {
    counts[order.createdAt.getDay()] += 1;
  }

  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const order = [1, 2, 3, 4, 5, 6, 0];

  return order.map((dayKey) => ({
    dayKey,
    dayLabel: labels[dayKey],
    orders: counts[dayKey],
  }));
}

function buildKarigarOutput(orders: OrderRow[]) {
  const map = new Map<string, { pieces: number; revenue: number }>();

  for (const order of orders) {
    const name = order.assignedToName?.trim();
    if (!name) continue;

    const existing = map.get(name);
    if (existing) {
      existing.pieces += 1;
      existing.revenue += Number(order.totalPrice);
    } else {
      map.set(name, {
        pieces: 1,
        revenue: Number(order.totalPrice),
      });
    }
  }

  return Array.from(map.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.pieces - a.pieces)
    .slice(0, 6);
}

function buildTopCustomers(orders: OrderRow[]) {
  const map = new Map<
    string,
    { customerName: string; revenue: number; orderCount: number }
  >();

  for (const order of orders) {
    const existing = map.get(order.customerId);
    if (existing) {
      existing.orderCount += 1;
      existing.revenue += Number(order.totalPrice);
    } else {
      map.set(order.customerId, {
        customerName: order.customer.name,
        revenue: Number(order.totalPrice),
        orderCount: 1,
      });
    }
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([customerId, row]) => ({
      customerId,
      customerName: row.customerName,
      revenue: row.revenue,
      orderCount: row.orderCount,
    }));
}

function percentChange(previous: number, current: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return Math.round(((current - previous) / previous) * 100);
}

function isInRange(date: Date, start: Date, end: Date) {
  return date >= start && date <= end;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function daysBetween(start: Date, end: Date) {
  const ms = endOfDay(end).getTime() - startOfDay(start).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
