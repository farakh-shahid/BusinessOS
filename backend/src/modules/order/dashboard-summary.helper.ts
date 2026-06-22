import type {
  DashboardCashSummary,
  DashboardDueWeekChart,
  DashboardGarmentMix,
  DashboardReadyPickupItem,
  DashboardTailorWorkloadItem,
  DashboardWeekDayKey,
  DashboardWorkload,
  DashboardWorkloadStage,
} from "@shared";
import { garmentKey, garmentLabel, toGarmentType } from "../common/tailor.mapper";

const WEEK_DAY_KEYS: DashboardWeekDayKey[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export function buildDashboardWorkload(counts: {
  booked: number;
  bookedToday: number;
  cutting: number;
  stitching: number;
  ready: number;
}): DashboardWorkload {
  const stages: { key: DashboardWorkloadStage; count: number }[] = [
    { key: "booked", count: counts.booked },
    { key: "cutting", count: counts.cutting },
    { key: "stitching", count: counts.stitching },
  ];

  const bottleneck = stages.reduce((max, stage) =>
    stage.count > max.count ? stage : max,
  ).key;

  return { ...counts, bottleneck };
}

export function percentChange(
  previous: number,
  current: number,
): number | null {
  if (previous === 0) {
    return current === 0 ? null : 100;
  }
  return Math.round(((current - previous) / previous) * 100);
}

export function buildWeeklyCollectedBuckets(
  payments: { amount: { toString(): string }; createdAt: Date }[],
  now = new Date(),
): { week: number; amount: number; isCurrent: boolean }[] {
  const monthStart = startOfMonth(now);
  const today = startOfDay(now);
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  const buckets: { week: number; amount: number; isCurrent: boolean }[] = [];

  for (let week = 1; week <= 5; week += 1) {
    const weekStartDay = (week - 1) * 7 + 1;
    if (weekStartDay > daysInMonth) break;

    const weekEndDay = Math.min(week * 7, daysInMonth);
    const weekStart = startOfDay(
      new Date(monthStart.getFullYear(), monthStart.getMonth(), weekStartDay),
    );
    const weekEnd = startOfDay(
      new Date(monthStart.getFullYear(), monthStart.getMonth(), weekEndDay + 1),
    );

    const amount = payments
      .filter(
        (payment) =>
          payment.createdAt >= weekStart && payment.createdAt < weekEnd,
      )
      .reduce((total, payment) => total + Number(payment.amount), 0);

    const isCurrent = today >= weekStart && today < weekEnd;

    buckets.push({ week, amount, isCurrent });
  }

  return buckets;
}

export function buildDailyCollectedBuckets(
  payments: { amount: { toString(): string }; createdAt: Date }[],
  days = 8,
): number[] {
  const today = startOfDay(new Date());
  const buckets: number[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const dayStart = addDays(today, -offset);
    const dayEnd = addDays(dayStart, 1);
    const sum = payments
      .filter(
        (payment) =>
          payment.createdAt >= dayStart && payment.createdAt < dayEnd,
      )
      .reduce((total, payment) => total + Number(payment.amount), 0);
    buckets.push(sum);
  }

  return buckets;
}

export function buildDashboardCash(input: {
  collectedThisMonth: number;
  collectedLastMonth: number;
  deliveredThisMonth: number;
  outstandingBalance: number;
  recentPayments: { amount: { toString(): string }; createdAt: Date }[];
}): DashboardCashSummary {
  return {
    collectedThisMonth: input.collectedThisMonth,
    deliveredThisMonth: input.deliveredThisMonth,
    changePercent: percentChange(
      input.collectedLastMonth,
      input.collectedThisMonth,
    ),
    outstandingBalance: input.outstandingBalance,
    weeklyCollected: buildWeeklyCollectedBuckets(input.recentPayments),
  };
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function dashboardMonthRanges(now = new Date()) {
  const monthStart = startOfMonth(now);
  const prevMonthStart = addMonths(monthStart, -1);
  const chartStart = addDays(startOfDay(now), -7);
  return { monthStart, prevMonthStart, chartStart };
}

export function buildDashboardDueWeekChart(
  orders: { deliveryDate: Date }[],
  overdueCount: number,
  now = new Date(),
): DashboardDueWeekChart {
  const today = startOfDay(now);
  const weekStart = startOfWeekSunday(today);

  const days = WEEK_DAY_KEYS.map((key, index) => {
    const dayDate = addDays(weekStart, index);
    const count = orders.filter((order) =>
      sameCalendarDay(new Date(order.deliveryDate), dayDate),
    ).length;

    return {
      key,
      count,
      isToday: sameCalendarDay(dayDate, today),
    };
  });

  const heaviest = days.reduce((max, day) =>
    day.count > max.count ? day : max,
  );

  return {
    days,
    heaviestDay: heaviest.key,
    heaviestCount: heaviest.count,
    overdueCount,
  };
}

export function dashboardDueWeekRange(now = new Date()) {
  const start = startOfWeekSunday(now);
  const end = endOfDay(addDays(start, 6));
  return { start, end };
}

function startOfWeekSunday(date: Date): Date {
  const start = startOfDay(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildReadyPickupSubtitle(
  garmentLabel: string,
  readySince: Date,
  now = new Date(),
): string {
  const today = startOfDay(now);
  const readyDay = startOfDay(readySince);
  const days = Math.max(
    0,
    Math.floor((today.getTime() - readyDay.getTime()) / 86_400_000),
  );
  const waiting =
    days === 0 ? "today" : days === 1 ? "1 day" : `${days} days`;
  return `${garmentLabel} · ${waiting}`;
}

export function buildReadyForPickupList(
  orders: {
    id: string;
    updatedAt: Date;
    garmentType: string;
    customer: { name: string };
  }[],
  labelForGarment: (type: string) => string,
  initialsForName: (name: string) => string,
): DashboardReadyPickupItem[] {
  return orders.map((order) => ({
    orderId: order.id,
    customerName: order.customer.name,
    customerInitials: initialsForName(order.customer.name),
    subtitle: buildReadyPickupSubtitle(
      labelForGarment(order.garmentType),
      order.updatedAt,
    ),
  }));
}

export function buildDashboardGarmentMix(
  orders: { garmentType: string }[],
  labelForGarment: (type: string) => string = (type) =>
    garmentLabel(toGarmentType(type)),
  otherLabel = "Other",
): DashboardGarmentMix {
  const counts = new Map<string, number>();

  for (const order of orders) {
    const type = toGarmentType(order.garmentType);
    const key = garmentKey(type);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return buildDashboardGarmentMixFromCounts(counts, labelForGarment, otherLabel);
}

export function buildDashboardGarmentMixFromCounts(
  counts: Map<string, number>,
  labelForGarment: (type: string) => string = (type) =>
    garmentLabel(toGarmentType(type)),
  otherLabel = "Other",
): DashboardGarmentMix {
  const totalOrders = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4);
  const restCount = sorted.slice(4).reduce((sum, [, count]) => sum + count, 0);

  const items = top.map(([garmentType, count]) => ({
    garmentType,
    garmentLabel: labelForGarment(garmentType),
    count,
    percent: totalOrders ? Math.round((count / totalOrders) * 100) : 0,
  }));

  if (restCount > 0) {
    items.push({
      garmentType: "__other__",
      garmentLabel: otherLabel,
      count: restCount,
      percent: totalOrders ? Math.round((restCount / totalOrders) * 100) : 0,
    });
  }

  return { totalOrders, items };
}

export function buildDashboardTailorWorkload(
  orders: { assignedToName: string | null }[],
  unassignedLabel = "Unassigned",
): DashboardTailorWorkloadItem[] {
  const counts = new Map<string, number>();
  let unassigned = 0;

  for (const order of orders) {
    const name = order.assignedToName?.trim();
    if (!name) {
      unassigned += 1;
      continue;
    }
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return buildDashboardTailorWorkloadFromCounts(counts, unassigned, unassignedLabel);
}

export function buildDashboardTailorWorkloadFromCounts(
  counts: Map<string, number>,
  unassigned: number,
  unassignedLabel = "Unassigned",
): DashboardTailorWorkloadItem[] {
  const assigned: DashboardTailorWorkloadItem[] = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  if (unassigned > 0) {
    assigned.push({
      name: unassignedLabel,
      count: unassigned,
      isUnassigned: true,
    });
  }

  return assigned;
}
