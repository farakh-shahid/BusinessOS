"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Order } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { DashboardQueueOrderCard } from "@/tailor/ui/dashboard/dashboard-queue-order-card";

interface DashboardQueueListProps {
  orders: Order[];
  showViewAll?: boolean;
}

export function DashboardQueueList({
  orders,
  showViewAll = true,
}: DashboardQueueListProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";
  const t = getDictionary(locale);

  return (
    <section className="space-y-3">
      {orders.map((order) => (
        <DashboardQueueOrderCard
          key={order.id}
          order={order}
          href={routes.orderDetail(order.id)}
          t={t}
        />
      ))}

      {showViewAll ? (
        <div className="pt-1 text-center">
          <Link
            href={routes.orders}
            className={cn(
              "inline-flex items-center gap-0.5 text-[13px] font-semibold text-accent-500 transition hover:text-accent-600",
              isRtl && "flex-row-reverse",
            )}
          >
            {t.orders.viewAll}
            <ChevronRight
              className={cn("h-4 w-4", isRtl && "rotate-180")}
              strokeWidth={2.5}
            />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
