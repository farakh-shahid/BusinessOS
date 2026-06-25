"use client";

import Link from "next/link";
import { CalendarCheck, CalendarClock, CalendarDays } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";

interface DashboardMobileMetricsProps {
  bookedToday: number;
  dueToday: number;
  dueTomorrow: number;
  t: Dictionary;
  isRtl?: boolean;
}

const metricStyles = {
  booked: {
    icon: CalendarCheck,
    iconClass: "bg-brand-50 text-brand-700",
    activeRing: "active:ring-brand-200",
  },
  dueToday: {
    icon: CalendarClock,
    iconClass: "bg-status-urgent-bg text-status-urgent",
    activeRing: "active:ring-status-urgent/30",
  },
  dueTomorrow: {
    icon: CalendarDays,
    iconClass: "bg-violet-50 text-violet-700",
    activeRing: "active:ring-violet-200",
  },
} as const;

export function DashboardMobileMetrics({
  bookedToday,
  dueToday,
  dueTomorrow,
  t,
  isRtl = false,
}: DashboardMobileMetricsProps) {
  const metrics = [
    {
      key: "booked",
      label: t.orderList.bookedTodayShort,
      value: bookedToday,
      href: routes.ordersWithFilter("booked_today"),
      ...metricStyles.booked,
    },
    {
      key: "dueToday",
      label: t.orderList.todayShort,
      value: dueToday,
      href: routes.ordersWithFilter("due_today"),
      ...metricStyles.dueToday,
    },
    {
      key: "dueTomorrow",
      label: t.orderDue.due_tomorrow,
      value: dueTomorrow,
      href: routes.ordersWithFilter("due_tomorrow"),
      ...metricStyles.dueTomorrow,
    },
  ] as const;

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-2 md:hidden",
        isRtl && "direction-rtl",
      )}
    >
      {metrics.map(({ key, label, value, href, icon: Icon, iconClass, activeRing }) => (
        <Link
          key={key}
          href={href}
          className={cn(
            "flex min-w-0 flex-col rounded-xl border border-hairline bg-card px-2.5 py-2.5 shadow-sm transition active:scale-[0.98] active:ring-2",
            activeRing,
            isRtl && "text-right",
          )}
        >
          <div
            className={cn(
              "mb-2 flex h-7 w-7 items-center justify-center rounded-lg",
              iconClass,
              isRtl ? "ml-auto" : "mr-auto",
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
          </div>
          <p className="font-display text-xl font-bold leading-none tabular-nums text-foreground">
            {value}
          </p>
          <p className="mt-1 line-clamp-2 text-[10px] font-semibold leading-tight text-muted-slate">
            {label}
          </p>
        </Link>
      ))}
    </div>
  );
}
