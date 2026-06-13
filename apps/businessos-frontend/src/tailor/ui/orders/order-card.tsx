"use client";

import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  MessageCircle,
  Phone,
  Scissors,
  Shirt,
  Zap,
} from "lucide-react";
import type { Order, OrderWorkflowStatus } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { AssignedToInput } from "./assigned-to-input";
import { OrderStatusSelect } from "./order-status-select";
import { OrderDueChip } from "./order-due-chip";
import { phoneTelHref } from "@/tailor/infrastructure/data/order-list-ui";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
  statusUpdating?: boolean;
  href: string;
  onMarkReady?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: OrderWorkflowStatus) => void;
  assigneeSuggestions?: string[];
  onAssignChange?: (orderId: string, assignedToName: string) => void | Promise<void>;
  assignmentUpdating?: boolean;
}

function MarkReadyButton({
  canMarkReady,
  actionLabel,
  onClick,
}: {
  canMarkReady: boolean;
  actionLabel: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pointer-events-auto relative z-10 flex w-[4.75rem] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 transition-colors",
        canMarkReady
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-brand-50 text-brand-700 hover:bg-brand-100",
      )}
      title={actionLabel}
    >
      {canMarkReady ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <MessageCircle className="h-5 w-5 shrink-0" />
      )}
      <span className="text-center text-[10px] font-semibold leading-tight">
        {actionLabel}
      </span>
    </button>
  );
}

export function OrderCard({
  order,
  isAdmin = false,
  statusUpdating,
  href,
  onMarkReady,
  onStatusChange,
  assigneeSuggestions = [],
  onAssignChange,
  assignmentUpdating = false,
}: OrderCardProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const canMarkReady =
    order.workflowStatus !== "ready" &&
    order.workflowStatus !== "delivered" &&
    order.workflowStatus !== "cancelled";
  const actionLabel = canMarkReady ? t.orders.markReady : t.orders.sendWhatsApp;
  const controlWidth = "w-full md:w-[10.5rem]";

  function handleMarkReady(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onMarkReady?.(order.id);
  }

  const customerNameBlock = (
    <>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1.5",
          isRtl && "flex-row-reverse justify-end",
        )}
      >
        <p className="truncate font-semibold text-slate-900">
          {order.customerName}
        </p>
        {order.isRush ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-full bg-status-urgent-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-status-urgent",
              isRtl && "flex-row-reverse",
            )}
          >
            <Zap className="h-2.5 w-2.5" />
            {t.orderDetail.rush}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-slate-400">#{order.orderNumber}</p>
    </>
  );

  const customerPhoneLink = (
    <a
      href={phoneTelHref(order.customerPhone)}
      className={cn(
        "pointer-events-auto relative z-10 flex items-center gap-1.5 text-sm font-medium text-brand-700 underline-offset-2 hover:underline",
        isRtl && "flex-row-reverse justify-end",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Phone className="h-3.5 w-3.5 shrink-0" />
      <span dir="ltr">{order.customerPhone}</span>
    </a>
  );

  const customerDetailsBlock = (
    <>
      <p
        className={cn(
          "flex items-center gap-1.5 text-sm text-slate-600",
          isRtl && "flex-row-reverse justify-end",
        )}
      >
        <Shirt className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="truncate">{order.items}</span>
      </p>

      {order.dressCode ? (
        <p className="text-xs text-slate-500">
          <span className="font-medium text-slate-600">{t.form.dressCode}:</span>{" "}
          {order.dressCode}
        </p>
      ) : null}

      {!onAssignChange && order.assignedToName ? (
        <p
          className={cn(
            "flex items-center gap-1 text-xs text-slate-500",
            isRtl && "flex-row-reverse justify-end",
          )}
        >
          <Scissors className="h-3 w-3 shrink-0 text-slate-400" />
          <span className="inline-flex min-w-0 items-baseline gap-1">
            <span className="shrink-0 font-medium text-slate-600">
              {t.form.assignedTo}:
            </span>
            <PersonNameText
              name={order.assignedToName}
              className="min-w-0 font-medium text-slate-600"
            />
          </span>
        </p>
      ) : null}
    </>
  );

  const customerInfoColumn = (
    <div className={cn("min-w-0 flex-1 space-y-1.5", isRtl && "text-right")}>
      <div className="space-y-1.5">{customerNameBlock}</div>
      {customerPhoneLink}
      <div className="space-y-1.5">{customerDetailsBlock}</div>
    </div>
  );

  const dateLines = (
    <div
      className={cn(
        "space-y-1.5 text-xs text-slate-500",
        isRtl ? "text-left md:text-left" : "text-left md:text-right",
      )}
    >
      <p
        className={cn(
          "flex items-center gap-1",
          isRtl && "flex-row-reverse justify-start md:justify-end",
        )}
      >
        <CalendarClock className="h-3 w-3 shrink-0 text-slate-400" />
        <span>
          <span className="text-slate-400">{t.form.bookingDate}:</span>{" "}
          <span className="font-medium text-slate-600">{order.bookingDate}</span>
        </span>
      </p>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          isRtl && "flex-row-reverse justify-start md:justify-end",
        )}
      >
        <OrderDueChip order={order} t={t} isRtl={isRtl} />
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border border-hairline bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        isRtl && "text-right",
      )}
    >
      <Link
        href={href}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={`${order.customerName}, ${order.orderNumber}`}
      />

      <div className="relative z-[1] pointer-events-none">
      {/* Mobile: stacked layout */}
      <div className="flex flex-col gap-3 md:hidden">
        <div
          className={cn(
            "flex min-w-0 items-start gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <UserAvatar name={order.customerName} className="shrink-0" />
          {customerInfoColumn}
        </div>

        {(onAssignChange || onStatusChange || onMarkReady) && (
          <div className="space-y-3 border-t border-slate-100 pt-3">
            {(onAssignChange || onStatusChange) && (
              <div className="pointer-events-auto relative z-10 flex flex-col gap-2">
                {onStatusChange ? (
                  <OrderStatusSelect
                    orderId={order.id}
                    workflowStatus={order.workflowStatus}
                    displayStatus={order.status}
                    isAdmin={isAdmin}
                    disabled={statusUpdating}
                    onChange={onStatusChange}
                    context="card"
                    className={controlWidth}
                  />
                ) : null}
                {onAssignChange ? (
                  <AssignedToInput
                    t={t}
                    value={order.assignedToName ?? ""}
                    onChange={() => {}}
                    onCommit={(assignedToName) =>
                      onAssignChange(order.id, assignedToName)
                    }
                    suggestions={assigneeSuggestions}
                    isRtl={isRtl}
                    disabled={assignmentUpdating}
                    compact
                    showLabel={false}
                    variant="tagged"
                    className={controlWidth}
                  />
                ) : null}
              </div>
            )}

            <div
              className={cn(
                "flex items-stretch gap-2",
                isRtl && "flex-row-reverse",
              )}
            >
              <div className="min-w-0 flex-1">{dateLines}</div>
              {onMarkReady ? (
                <MarkReadyButton
                  canMarkReady={canMarkReady}
                  actionLabel={actionLabel}
                  onClick={handleMarkReady}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: original horizontal layout */}
      <div
        className={cn(
          "hidden w-full items-stretch gap-3 md:flex",
          isRtl && "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <UserAvatar name={order.customerName} className="shrink-0" />
          {customerInfoColumn}
        </div>

        {(onAssignChange || onStatusChange || onMarkReady) && (
          <div
            className={cn(
              "flex shrink-0 items-stretch gap-2",
              isRtl && "flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "pointer-events-auto relative z-10 flex flex-col items-end justify-center gap-2",
                isRtl && "items-start",
              )}
            >
              {onStatusChange ? (
                <OrderStatusSelect
                  orderId={order.id}
                  workflowStatus={order.workflowStatus}
                  displayStatus={order.status}
                  isAdmin={isAdmin}
                  disabled={statusUpdating}
                  onChange={onStatusChange}
                  context="card"
                  className={controlWidth}
                />
              ) : null}

              {onAssignChange ? (
                <AssignedToInput
                  t={t}
                  value={order.assignedToName ?? ""}
                  onChange={() => {}}
                  onCommit={(assignedToName) =>
                    onAssignChange(order.id, assignedToName)
                  }
                  suggestions={assigneeSuggestions}
                  isRtl={isRtl}
                  disabled={assignmentUpdating}
                  compact
                  showLabel={false}
                  variant="tagged"
                  className={controlWidth}
                />
              ) : null}

              {dateLines}
            </div>

            {onMarkReady ? (
              <MarkReadyButton
                canMarkReady={canMarkReady}
                actionLabel={actionLabel}
                onClick={handleMarkReady}
              />
            ) : null}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
