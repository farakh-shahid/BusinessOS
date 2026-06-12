"use client";

import Link from "next/link";
import {
  Calendar,
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

  return (
    <div
      className={cn(
        "flex w-full items-stretch gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        isRtl && "flex-row-reverse",
      )}
    >
      <Link
        href={href}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <UserAvatar name={order.customerName} />

        <div className={cn("min-w-0 flex-1 space-y-1.5", isRtl && "text-right")}>
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
                  "inline-flex shrink-0 items-center gap-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-700",
                  isRtl && "flex-row-reverse",
                )}
              >
                <Zap className="h-2.5 w-2.5" />
                {t.orderDetail.rush}
              </span>
            ) : null}
          </div>

          <p className="text-xs text-slate-400">#{order.orderNumber}</p>

          <p
            className={cn(
              "flex items-center gap-1.5 text-sm text-slate-600",
              isRtl && "flex-row-reverse justify-end",
            )}
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span dir="ltr">{order.customerPhone}</span>
          </p>

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
              <span className="font-medium text-slate-600">
                {t.form.dressCode}:
              </span>{" "}
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
              <span>
                <span className="font-medium text-slate-600">
                  {t.form.assignedTo}:
                </span>{" "}
                {order.assignedToName}
              </span>
            </p>
          ) : null}
        </div>
      </Link>

      <div
        className={cn(
          "flex shrink-0 items-stretch gap-2",
          isRtl && "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-end justify-center gap-2",
            isRtl && "items-start",
          )}
        >
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
              className="w-[10.5rem]"
            />
          ) : null}

          {onStatusChange ? (
            <OrderStatusSelect
              orderId={order.id}
              workflowStatus={order.workflowStatus}
              displayStatus={order.status}
              isAdmin={isAdmin}
              disabled={statusUpdating}
              onChange={onStatusChange}
              context="card"
              className="w-[10rem]"
            />
          ) : null}

          <div
            className={cn(
              "space-y-0.5 text-xs text-slate-500",
              isRtl ? "text-left" : "text-right",
            )}
          >
            <p
              className={cn(
                "flex items-center gap-1",
                isRtl && "flex-row-reverse justify-start",
              )}
            >
              <CalendarClock className="h-3 w-3 shrink-0 text-slate-400" />
              <span>
                <span className="text-slate-400">{t.form.bookingDate}:</span>{" "}
                <span className="font-medium text-slate-600">
                  {order.bookingDate}
                </span>
              </span>
            </p>
            <p
              className={cn(
                "flex items-center gap-1",
                isRtl && "flex-row-reverse justify-start",
              )}
            >
              <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
              <span>
                <span className="text-slate-400">{t.form.dueDate}:</span>{" "}
                <span className="font-medium text-slate-600">
                  {order.dueDate}
                </span>
              </span>
            </p>
          </div>
        </div>

        {onMarkReady ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMarkReady(order.id);
            }}
            className={cn(
              "flex w-[4.75rem] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 transition-colors",
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
        ) : null}
      </div>
    </div>
  );
}
