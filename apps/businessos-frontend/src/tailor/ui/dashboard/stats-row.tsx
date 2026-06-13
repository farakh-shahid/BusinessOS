"use client";

import { CheckCircle2, ClipboardList, Clock, Scissors } from "lucide-react";
import type { DashboardStats } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { StatCard } from "./stat-card";

interface StatsRowProps {
  stats: DashboardStats;
}

export function StatsRow({ stats }: StatsRowProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:gap-6">
      <StatCard
        label={t.stats.totalOrders}
        value={stats.totalOrders}
        icon={ClipboardList}
        tone="brand"
        active
        href={routes.orders}
      />
      <StatCard
        label={t.stats.inProgress}
        value={stats.inProgress}
        icon={Scissors}
        tone="violet"
        href={routes.ordersWithFilter("in_progress")}
      />
      <StatCard
        label={t.stats.dueToday}
        value={stats.dueToday}
        icon={Clock}
        tone="amber"
        href={routes.ordersWithFilter("due_today")}
      />
      <StatCard
        label={t.stats.ready}
        value={stats.ready}
        icon={CheckCircle2}
        tone="emerald"
        href={routes.ordersWithFilter("ready_not_delivered")}
      />
    </div>
  );
}
