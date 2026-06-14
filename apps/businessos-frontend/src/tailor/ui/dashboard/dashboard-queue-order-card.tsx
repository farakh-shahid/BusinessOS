"use client";

import Link from "next/link";
import { Phone, Scissors, Shirt, Zap } from "lucide-react";
import type { Order } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import {
  phoneTelHref,
  resolveDueUrgency,
} from "@/tailor/infrastructure/data/order-list-ui";
import { OrderDueChip } from "@/tailor/ui/orders/order-due-chip";
import { OrderWorkflowStatusBadge } from "@/tailor/ui/orders/order-workflow-status-badge";
import { OrderWorkflowStepper } from "@/tailor/ui/orders/order-workflow-stepper";

interface DashboardQueueOrderCardProps {
  order: Order;
  href: string;
  t: Dictionary;
}

export function DashboardQueueOrderCard({
  order,
  href,
  t,
}: DashboardQueueOrderCardProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";

  const urgency = resolveDueUrgency(
    order.dueDate,
    order.status,
    order.workflowStatus === "delivered",
  );

  const showDueChip =
    urgency &&
    (urgency.key === "overdue" ||
      urgency.key === "due_today" ||
      urgency.key === "due_tomorrow");

  const stepperLabels = {
    pending: t.dashboard.workload.booked,
    cutting: t.dashboard.workload.cutting,
    stitching: t.dashboard.workload.stitching,
    ready: t.dashboard.workload.ready,
  } as const;

  return (
    <article
      className={cn(
        "relative rounded-2xl border border-hairline bg-card px-[17px] py-[15px] shadow-sm transition-shadow hover:shadow-[0_8px_22px_rgba(14,26,54,0.07)]",
        isRtl && "text-right",
      )}
    >
      <Link
        href={href}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={`${order.customerName}, ${order.orderNumber}`}
      />

      <div className="relative z-[1] pointer-events-none">
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 items-start gap-3",
              isRtl && "flex-row-reverse",
            )}
          >
            <UserAvatar name={order.customerName} size="lg" className="h-[42px] w-[42px]" />

            <div className="min-w-0 space-y-1">
              <div
                className={cn(
                  "flex flex-wrap items-center gap-2",
                  isRtl && "flex-row-reverse",
                )}
              >
                <p className="font-display text-sm font-bold text-foreground">
                  <PersonNameText name={order.customerName} />
                </p>
                {order.isRush ? (
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <Zap className="h-2.5 w-2.5" />
                    {t.orderDetail.rush}
                  </span>
                ) : null}
              </div>

              <p className="font-display text-[11px] text-muted-slate">
                #{order.orderNumber}
              </p>

              <div
                className={cn(
                  "flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-muted-slate",
                  isRtl && "flex-row-reverse",
                )}
              >
                <a
                  href={phoneTelHref(order.customerPhone)}
                  className={cn(
                    "pointer-events-auto relative z-10 inline-flex items-center gap-1 font-medium text-muted-slate hover:text-brand-700",
                    isRtl && "flex-row-reverse",
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-3 w-3 shrink-0" />
                  <span dir="ltr">{order.customerPhone}</span>
                </a>
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <Shirt className="h-3 w-3 shrink-0" />
                  {order.items}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <Scissors className="h-3 w-3 shrink-0" />
                  {order.assignedToName ? (
                    <PersonNameText
                      name={order.assignedToName}
                      className="font-medium text-foreground"
                    />
                  ) : (
                    <span className="font-medium text-muted-slate">
                      {t.form.assignedToNone}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex shrink-0 flex-col items-end gap-1.5",
              isRtl && "items-start",
            )}
          >
            <OrderWorkflowStatusBadge workflowStatus={order.workflowStatus} t={t} />
            {showDueChip ? (
              <OrderDueChip order={order} t={t} isRtl={isRtl} />
            ) : (
              <span className="text-[11px] font-semibold text-muted-slate">
                {t.form.dueDate} {order.dueDate}
              </span>
            )}
          </div>
        </div>

        <OrderWorkflowStepper
          workflowStatus={order.workflowStatus}
          labels={stepperLabels}
          isRtl={isRtl}
          className="mt-3.5"
        />
      </div>
    </article>
  );
}
