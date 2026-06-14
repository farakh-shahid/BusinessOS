"use client";

import Link from "next/link";
import type { Order } from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { cn } from "@/core/presentation/lib/utils";

interface DashboardDueWeekPanelProps {
  orders: Order[];
  title: string;
  isRtl?: boolean;
}

function isDueWithinWeek(dueDateStr: string): boolean {
  const parsed = new Date(dueDateStr);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(parsed);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  return diff >= 0 && diff <= 7;
}

export function DashboardDueWeekPanel({
  orders,
  title,
  isRtl,
}: DashboardDueWeekPanelProps) {
  const dueSoon = orders
    .filter(
      (o) =>
        o.workflowStatus !== "delivered" &&
        o.workflowStatus !== "cancelled" &&
        isDueWithinWeek(o.dueDate),
    )
    .slice(0, 6);

  return (
    <Card className="p-4 md:p-4">
      <CardTitle>{title}</CardTitle>
      {dueSoon.length === 0 ? (
        <p className="mt-3 text-sm text-muted-slate">—</p>
      ) : (
        <ul className="mt-3 space-y-0">
          {dueSoon.map((order) => (
            <li key={order.id}>
              <Link
                href={routes.orderDetail(order.id)}
                className={cn(
                  "flex items-center justify-between gap-2 border-b border-hairline py-2.5 text-[13px] transition last:border-b-0 hover:text-brand-700",
                  isRtl && "flex-row-reverse",
                )}
              >
                <span className="min-w-0 truncate font-medium text-foreground">
                  {order.customerName}
                </span>
                <span className="shrink-0 font-semibold text-muted-slate">
                  {order.dueDate}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
