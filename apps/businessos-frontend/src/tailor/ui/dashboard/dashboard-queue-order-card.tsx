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
  getOrderCardSurfaceClass,
  phoneTelHref,
  resolveDueUrgency,
} from "@/tailor/infrastructure/data/order-list-ui";
import { OrderDueChip } from "@/tailor/ui/orders/order-due-chip";
import { OrderWorkflowStatusBadge } from "@/tailor/ui/orders/order-workflow-status-badge";
import { OrderWorkflowStepper } from "@/tailor/ui/orders/order-workflow-stepper";
import { CustomerStatusChip } from "@/tailor/ui/customers/customer-status-chips";

interface DashboardQueueOrderCardProps {
  order: Order;
  href: string;
  t: Dictionary;
}

/** Shared pill style for VIP, RUSH, and status on dashboard queue cards. */
const queueInlineChipClass =
  "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide leading-none";

function FadedDottedRule({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px w-full", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgb(226 232 240) 0, rgb(226 232 240) 4px, transparent 4px, transparent 8px)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
      aria-hidden
    />
  );
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

  const isDueOverdue = urgency?.key === "overdue";
  const cardSurfaceClass = getOrderCardSurfaceClass(order);

  const stepperLabels = {
    pending: t.dashboard.workload.booked,
    cutting: t.dashboard.workload.cutting,
    stitching: t.dashboard.workload.stitching,
    ready: t.dashboard.workload.ready,
    delivered: t.status.delivered,
  } as const;

  const dueDisplay = showDueChip ? (
    <OrderDueChip
      order={order}
      t={t}
      isRtl={isRtl}
      className={isDueOverdue ? "border-rose-400 bg-rose-100 text-rose-700 shadow-sm" : undefined}
    />
  ) : (
    <span className="text-[10px] font-semibold text-muted-slate">
      {t.customers.dueOn.replace("{date}", order.dueDate)}
    </span>
  );

  const bookedLabel = t.customers.bookedOn.replace("{date}", order.bookingDate);

  const rushBadge = order.isRush ? (
    <span
      className={cn(
        queueInlineChipClass,
        "bg-rose-50 text-rose-600",
        isRtl && "flex-row-reverse",
      )}
    >
      <Zap className="h-3 w-3 shrink-0" />
      {t.orderDetail.rush}
    </span>
  ) : null;

  const vipBadge = order.customerIsVip ? (
    <CustomerStatusChip
      variant="vip"
      label={t.customers.tagVip}
      className={cn(
        queueInlineChipClass,
        "rounded-full border border-amber-200/80 bg-amber-50 text-amber-800 tracking-wide",
      )}
    />
  ) : null;

  const statusChip = (
    <OrderWorkflowStatusBadge
      workflowStatus={order.workflowStatus}
      t={t}
      size="compact"
      className={queueInlineChipClass}
    />
  );

  return (
    <article
      className={cn(
        "relative rounded-2xl border bg-card px-[17px] py-[15px] shadow-sm transition-shadow hover:shadow-[0_8px_22px_rgba(14,26,54,0.07)]",
        cardSurfaceClass,
        isRtl && "text-right",
      )}
    >
      <Link
        href={href}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={`${order.customerName}, ${order.orderNumber}`}
      />

      <div
        className={cn(
          "pointer-events-none absolute top-[15px] z-[2] max-w-[46%]",
          isRtl ? "left-[17px]" : "right-[17px]",
        )}
      >
        {dueDisplay}
      </div>

      <div className="relative z-[1] pointer-events-none">
        <div
          className={cn(
            "flex min-w-0 items-start gap-3",
            isRtl ? "flex-row-reverse pl-[5.5rem]" : "flex-row pr-[5.5rem]",
          )}
        >
          <UserAvatar
            name={order.customerName}
            size="lg"
            className="h-[42px] w-[42px] shrink-0"
          />

          <div className="min-w-0 flex-1 space-y-1">
            <div
              className={cn(
                "flex flex-wrap items-center gap-1.5",
                isRtl && "flex-row-reverse",
              )}
            >
              <p className="min-w-0 font-display text-sm font-bold text-foreground">
                <PersonNameText name={order.customerName} />
              </p>
              {vipBadge}
              {rushBadge}
              <span className="hidden md:contents">{statusChip}</span>
            </div>

            <div
              className={cn(
                "md:hidden",
                isRtl ? "flex justify-end" : "flex justify-start",
              )}
            >
              {statusChip}
            </div>

            <p
              className={cn(
                "font-display text-[11px] text-muted-slate",
                isRtl && "text-right",
              )}
            >
              <span>#{order.orderNumber}</span>
              <span className="hidden md:inline">
                <span className="mx-1.5 text-slate-300">·</span>
                <span>{bookedLabel}</span>
              </span>
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

        <div className="mt-3 md:hidden">
          <FadedDottedRule />
          <p
            className={cn(
              "pt-2.5 text-[10px] font-medium text-muted-slate",
              isRtl ? "text-left" : "text-right",
            )}
          >
            {bookedLabel}
          </p>
        </div>

        <OrderWorkflowStepper
          workflowStatus={order.workflowStatus}
          labels={stepperLabels}
          isRtl={isRtl}
          className="mt-3.5 hidden md:block"
        />
      </div>
    </article>
  );
}
