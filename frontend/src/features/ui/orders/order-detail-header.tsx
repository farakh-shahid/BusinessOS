"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Phone, Zap } from "lucide-react";
import type { OrderFullDetail, OrderWorkflowStatus } from "@shared";
import type { Dictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import {
  phoneTelHref,
  resolveDueUrgency,
} from "@/features/infrastructure/data/order-list-ui";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import { OrderStatusSelect } from "@/features/ui/orders/order-status-select";
import { OrderDetailPanel } from "@/features/ui/orders/order-detail-panel";

interface OrderDetailHeaderProps {
  order: OrderFullDetail;
  t: Dictionary;
  isRtl: boolean;
  locale: string;
  dressThumb?: string | null;
  cardSurfaceClass?: string;
  isCancelled: boolean;
  cancelledAt: string | null;
  isAdmin: boolean;
  canChangeStatus: boolean;
  statusUpdating: boolean;
  userRole?: string;
  onStatusChange: (orderId: string, status: OrderWorkflowStatus) => void;
}

function customerInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function formatRs(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString()}`;
}

function formatDetailDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === "ur" ? "ur-PK" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MetaCell({
  label,
  value,
  sub,
  tone = "default",
  isRtl,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "urgent" | "success" | "muted";
  isRtl?: boolean;
}) {
  const toneClass = {
    default: "border-hairline bg-slate-50/70",
    urgent: "border-rose-200 bg-rose-50/80",
    success: "border-emerald-200 bg-emerald-50/70",
    muted: "border-slate-200 bg-slate-100/80",
  }[tone];

  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border px-3 py-2.5",
        toneClass,
        isRtl && "text-right",
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-slate">
        {label}
      </p>
      <div className="mt-1 font-display text-sm font-bold leading-snug text-foreground">
        {value}
      </div>
      {sub ? (
        <div className="mt-0.5 text-[11px] font-medium text-muted-slate">{sub}</div>
      ) : null}
    </div>
  );
}

export function OrderDetailHeader({
  order,
  t,
  isRtl,
  locale,
  dressThumb,
  cardSurfaceClass,
  isCancelled,
  cancelledAt,
  isAdmin,
  canChangeStatus,
  statusUpdating,
  userRole,
  onStatusChange,
}: OrderDetailHeaderProps) {
  const dressCode = order.dressCode?.trim();
  const showDressCode = Boolean(dressCode && dressCode !== order.orderNumber);

  const urgency = resolveDueUrgency(
    order.dueDate,
    order.status,
    order.workflowStatus === "delivered",
  );

  const dueSub =
    urgency && !isCancelled
      ? urgency.key === "overdue"
        ? t.orderDue.overdue
        : urgency.key === "due_today"
          ? t.orderDue.due_today
          : urgency.key === "due_tomorrow"
            ? t.orderDue.due_tomorrow
            : null
      : null;

  const dueTone =
    urgency?.key === "overdue" || urgency?.key === "due_today"
      ? "urgent"
      : "default";

  return (
    <OrderDetailPanel
      className={cardSurfaceClass !== "border-hairline" ? cardSurfaceClass : undefined}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          isRtl && "text-right",
        )}
      >
        <div
          className={cn(
            "flex items-start gap-3.5",
            isRtl && "flex-row-reverse",
          )}
        >
          <div className="relative shrink-0">
            <div
              className={cn(
                "grid place-items-center rounded-[14px] font-display text-lg font-bold text-white",
                getAvatarPaletteClass(order.customerName),
              )}
              style={{ width: 52, height: 52 }}
              aria-hidden
            >
              {customerInitials(order.customerName)}
            </div>
            {dressThumb ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={dressThumb}
                alt={dressCode ?? t.form.dressImage}
                className="absolute -bottom-1 -right-1 h-9 w-9 rounded-lg object-cover ring-2 ring-white shadow-sm"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div
              className={cn(
                "flex flex-wrap items-start justify-between gap-2",
                isRtl && "flex-row-reverse",
              )}
            >
              <div className="min-w-0 space-y-1">
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-2",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <Link
                    href={routes.customerDetail(order.customerId)}
                    className="font-display text-xl font-bold leading-tight text-foreground transition hover:text-brand-700 sm:text-[22px]"
                  >
                    <PersonNameText name={order.customerName} />
                  </Link>
                  {order.isRush && !isCancelled ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <Zap className="h-3 w-3" />
                      {t.orderDetail.rush}
                    </span>
                  ) : null}
                </div>
                <p className="text-[13px] font-medium text-muted-slate">
                  {order.garmentLabel}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "flex flex-wrap items-center gap-2",
                isRtl && "flex-row-reverse",
              )}
            >
              <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-display text-[12px] font-bold tabular-nums text-foreground">
                #{order.orderNumber}
              </span>
              {showDressCode ? (
                <span className="inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-800">
                  {t.orderDetail.suitNumber}: {dressCode}
                </span>
              ) : null}
            </div>

            <a
              href={phoneTelHref(order.customerPhone)}
              className={cn(
                "inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-700 hover:underline",
                isRtl && "flex-row-reverse",
              )}
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span dir="ltr">{order.customerPhone}</span>
            </a>
          </div>
        </div>

        {isCancelled ? (
          <div
            className={cn(
              "flex flex-wrap gap-2",
              isRtl && "flex-row-reverse",
            )}
          >
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {cancelledAt
                ? t.orderDetail.cancelledOn.replace(
                    "{date}",
                    formatDetailDate(cancelledAt, locale),
                  )
                : t.orderStatus.cancelled}
            </span>
            {isAdmin && order.balanceDue > 0 ? (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {t.orderDetail.cancelledBalancePending.replace(
                  "{amount}",
                  order.balanceDue.toLocaleString(),
                )}
              </span>
            ) : null}
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-2",
              isAdmin ? "grid-cols-3" : "grid-cols-2",
            )}
          >
            <MetaCell
              label={t.form.bookingDate}
              value={order.bookingDate || "—"}
              sub={
                order.bookedByName?.trim() ? (
                  <>
                    {t.orderDetail.bookedBy}{" "}
                    <PersonNameText
                      name={order.bookedByName}
                      className="font-semibold text-foreground"
                    />
                  </>
                ) : undefined
              }
              isRtl={isRtl}
            />
            <MetaCell
              label={t.form.deliveryDate}
              value={order.dueDate || "—"}
              sub={dueSub}
              tone={dueTone}
              isRtl={isRtl}
            />
            {isAdmin ? (
              <MetaCell
                label={t.orderDetail.remainingBalance}
                value={
                  order.balanceDue > 0 ? formatRs(order.balanceDue) : formatRs(0)
                }
                tone={order.balanceDue > 0 ? "urgent" : "success"}
                isRtl={isRtl}
              />
            ) : null}
          </div>
        )}

        <div
          className={cn(
            "border-t border-hairline pt-4",
            isRtl && "text-right",
          )}
        >
          <OrderStatusSelect
            orderId={order.id}
            workflowStatus={order.workflowStatus}
            displayStatus={order.status}
            userRole={userRole}
            disabled={statusUpdating || !canChangeStatus}
            onChange={onStatusChange}
            context="detail"
            className="w-full shrink-0 sm:ml-auto sm:w-auto sm:min-w-[11rem]"
          />
        </div>
      </div>
    </OrderDetailPanel>
  );
}
