"use client";

import Link from "next/link";
import type { Order, OrderWorkflowStatus } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";

interface DashboardDueWeekPanelProps {
  orders: Order[];
  title: string;
  isRtl?: boolean;
}

function parseDueDateParts(
  dueDateStr: string,
  locale: string,
): { day: string; month: string } {
  const parsed = new Date(dueDateStr);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      day: String(parsed.getDate()),
      month: parsed
        .toLocaleDateString(locale === "ur" ? "ur-PK" : "en-US", {
          month: "short",
        })
        .toUpperCase(),
    };
  }

  const match = dueDateStr.match(/^([A-Za-z]+)\s+(\d{1,2})/);
  if (match) {
    return {
      day: match[2],
      month: match[1].slice(0, 3).toUpperCase(),
    };
  }

  return { day: "—", month: "" };
}

function workflowDotClass(
  workflowStatus: OrderWorkflowStatus,
  isRush?: boolean,
): string {
  if (isRush) return "bg-status-urgent";

  switch (workflowStatus) {
    case "pending":
      return "bg-status-booked";
    case "cutting":
      return "bg-status-cutting";
    case "stitching":
      return "bg-status-stitching";
    case "ready":
      return "bg-status-ready";
    default:
      return "bg-muted-slate";
  }
}

function orderSubtitle(order: Order, t: Dictionary): string {
  const garment = order.garmentLabel || order.items.replace(/^\d+\s*x\s*/i, "");
  if (order.isRush) {
    return `${garment} · ${t.orderDetail.rush}`;
  }
  return garment;
}

export function DashboardDueWeekPanel({
  orders,
  title,
  isRtl = false,
}: DashboardDueWeekPanelProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);

  return (
    <section className="rounded-2xl border border-hairline bg-card shadow-sm">
      <div className={cn("px-4 py-4 sm:px-[17px]", isRtl && "text-right")}>
        <h2 className="font-display text-sm font-bold text-foreground">
          {title}
        </h2>
      </div>

      {orders.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-muted-slate sm:px-[17px]">—</p>
      ) : (
        <ul>
          {orders.map((order) => {
            const { day, month } = parseDueDateParts(order.dueDate, locale);

            return (
              <li key={order.id}>
                <Link
                  href={routes.orderDetail(order.id)}
                  className={cn(
                    "flex items-center gap-2.5 border-b border-hairline px-4 py-2 transition hover:bg-slate-50/80 last:border-b-0 sm:px-[17px]",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <div className="w-[38px] shrink-0 text-center">
                    <div className="font-display text-[15px] font-bold leading-none text-foreground">
                      {day}
                    </div>
                    <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-slate">
                      {month}
                    </div>
                  </div>

                  <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                    <p className="truncate text-xs font-semibold text-foreground">
                      <PersonNameText name={order.customerName} />
                    </p>
                    <p className="truncate text-[10.5px] text-muted-slate">
                      {orderSubtitle(order, t)}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "ml-auto h-2 w-2 shrink-0 rounded-full",
                      workflowDotClass(order.workflowStatus, order.isRush),
                      isRtl && "ml-0 mr-auto",
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
