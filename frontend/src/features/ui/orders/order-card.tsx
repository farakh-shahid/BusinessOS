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
import type { Order, OrderWorkflowStatus } from "@shared";
import { getDictionary } from "@/i18n";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { OrderStatusSelect } from "./order-status-select";
import { OrderWorkflowStatusBadge } from "./order-workflow-status-badge";
import { OrderDueChip } from "./order-due-chip";
import { OrderWorkflowStepper } from "./order-workflow-stepper";
import {
  getOrderCardSurfaceClass,
  phoneTelHref,
  compactPersonName,
  currentStageWorkerLine,
  productionStageAssignees,
} from "@/features/infrastructure/data/order-list-ui";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import { CustomerStatusChip } from "@/features/ui/customers/customer-status-chips";

const mobileInlineChipClass =
  "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide leading-none";

interface OrderCardProps {
  order: Order;
  userRole?: string | null;
  statusUpdating?: boolean;
  href: string;
  onMarkReady?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: OrderWorkflowStatus) => void;
}

function StageWorkerReadout({
  order,
  t,
  isRtl,
  className,
}: {
  order: Order;
  t: ReturnType<typeof getDictionary>;
  isRtl?: boolean;
  className?: string;
}) {
  const worker = currentStageWorkerLine(order);
  if (!worker) return null;

  const stageLabel =
    worker.stage === "cutting"
      ? t.orderStatus.cutting
      : t.orderStatus.stitching;
  const displayName = worker.name?.trim()
    ? compactPersonName(worker.name)
    : t.orderList.stageWorkerUnassigned;

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-lg border border-hairline bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600",
        isRtl && "flex-row-reverse",
        className,
      )}
      title={
        worker.name?.trim()
          ? `${stageLabel}: ${worker.name.trim()} · ${t.orderList.changeWorkerOnDetail}`
          : t.orderList.changeWorkerOnDetail
      }
    >
      <Scissors className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <span className="min-w-0 whitespace-nowrap">
        <span className="font-medium text-slate-500">{stageLabel}:</span>{" "}
        <span
          className={cn(
            "font-semibold",
            worker.name?.trim() ? "text-foreground" : "text-muted-slate",
          )}
        >
          {displayName}
        </span>
      </span>
    </div>
  );
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
  userRole,
  statusUpdating,
  href,
  onMarkReady,
  onStatusChange,
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
  const cardSurfaceClass = getOrderCardSurfaceClass(order);
  const isDelivered = order.workflowStatus === "delivered";
  const showMobileStatusDropdown = Boolean(onStatusChange);
  const statusBadge = (
    <OrderWorkflowStatusBadge workflowStatus={order.workflowStatus} t={t} />
  );

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
        <p className="truncate font-display font-bold text-slate-900">
          <PersonNameText name={order.customerName} />
        </p>
        {order.customerIsVip ? (
          <CustomerStatusChip
            variant="vip"
            label={t.customers.tagVip}
            className={cn(
              mobileInlineChipClass,
              "border border-amber-200/80 bg-amber-50 text-amber-800",
            )}
          />
        ) : null}
        {order.isRush ? (
          <span
            className={cn(
              mobileInlineChipClass,
              "bg-status-urgent-bg text-status-urgent",
              isRtl && "flex-row-reverse",
            )}
          >
            <Zap className="h-2.5 w-2.5" />
            {t.orderDetail.rush}
          </span>
        ) : null}
        <OrderDueChip order={order} t={t} isRtl={isRtl} size="compact" />
        {isDelivered ? (
          <OrderWorkflowStatusBadge
            workflowStatus="delivered"
            t={t}
            size="compact"
            className={cn(mobileInlineChipClass, "md:hidden")}
          />
        ) : null}
      </div>
      <p
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-xs text-slate-400",
          isRtl && "flex-row-reverse justify-end",
        )}
      >
        <span className="font-display tabular-nums">#{order.orderNumber}</span>
        {order.dressCode?.trim() ? (
          <>
            <span aria-hidden className="text-slate-300">
              ·
            </span>
            <span className="font-medium text-brand-700">
              {t.orderDetail.suitNumber}: {order.dressCode.trim()}
            </span>
          </>
        ) : null}
        <span aria-hidden className="text-slate-300">
          ·
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1",
            isRtl && "flex-row-reverse",
          )}
        >
          <CalendarClock className="h-3 w-3 shrink-0" />
          <span className="text-[10px] font-medium text-slate-400">
            {t.orderList.boardBooked}
          </span>
          <span className="font-medium text-slate-500">{order.bookingDate}</span>
        </span>
        {order.bookedByName?.trim() ? (
          <>
            <span aria-hidden className="text-slate-300">
              ·
            </span>
            <span
              className={cn(
                "inline-flex min-w-0 items-center gap-1",
                isRtl && "flex-row-reverse",
              )}
            >
              <span className="text-[10px] font-medium text-slate-400">
                {t.orderDetail.bookedBy}
              </span>
              <PersonNameText
                name={order.bookedByName}
                className="truncate font-medium text-slate-500"
              />
            </span>
          </>
        ) : null}
      </p>
    </>
  );

  const customerPhoneLink = (
    <div
      className={cn(
        "pointer-events-auto relative z-10 flex flex-wrap items-center gap-x-2 gap-y-0.5",
        isRtl && "flex-row-reverse justify-end",
      )}
    >
      <a
        href={phoneTelHref(order.customerPhone)}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline-offset-2 hover:underline",
          isRtl && "flex-row-reverse",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Phone className="h-3.5 w-3.5 shrink-0" />
        <span dir="ltr">{order.customerPhone}</span>
      </a>
    </div>
  );

  const stageAssignees = productionStageAssignees(order);

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

      <StageWorkerReadout
        order={order}
        t={t}
        isRtl={isRtl}
        className="md:hidden"
      />
    </>
  );

  const customerInfoColumn = (
    <div className={cn("min-w-0 flex-1 space-y-1", isRtl && "text-right")}>
      <div className="space-y-1">{customerNameBlock}</div>
      {customerPhoneLink}
      <div className="space-y-1">{customerDetailsBlock}</div>
    </div>
  );

  const stepperLabels = {
    pending: t.orderStatus.pending,
    cutting: t.orderList.stepCutShort,
    stitching: t.orderList.stepStitchShort,
    ready: t.orderStatus.ready,
    delivered: t.orderStatus.delivered,
  } as const;

  const progressStepper = (
    <OrderWorkflowStepper
      workflowStatus={order.workflowStatus}
      labels={stepperLabels}
      stageAssignees={stageAssignees}
      isRtl={isRtl}
      className="mt-1"
    />
  );

  const mobileHasFooter =
    showMobileStatusDropdown || onMarkReady;

  return (
    <div
      className={cn(
        "relative w-full overflow-visible rounded-2xl border bg-card px-4 py-3 shadow-sm transition-shadow hover:shadow-[0_8px_22px_rgba(14,26,54,0.07)] sm:px-[18px]",
        cardSurfaceClass,
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
      <div className="flex flex-col gap-2.5 md:hidden">
        <div
          className={cn(
            "flex min-w-0 items-start gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <UserAvatar name={order.customerName} className="shrink-0" />
          {customerInfoColumn}
        </div>

        {mobileHasFooter ? (
          <div className="space-y-3 border-t border-hairline pt-3">
            <div className="pointer-events-auto relative z-10 flex flex-col gap-2.5">
              {showMobileStatusDropdown ? (
                <OrderStatusSelect
                  orderId={order.id}
                  workflowStatus={order.workflowStatus}
                  displayStatus={order.status}
                  userRole={userRole}
                  disabled={statusUpdating}
                  onChange={onStatusChange!}
                  context="card"
                  className="w-full"
                />
              ) : null}
            </div>

            <div className="space-y-2.5">
              {onMarkReady ? (
                <button
                  type="button"
                  onClick={handleMarkReady}
                  className={cn(
                    "pointer-events-auto relative z-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                    canMarkReady
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-brand-50 text-brand-700 hover:bg-brand-100",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  {canMarkReady ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <MessageCircle className="h-4 w-4 shrink-0" />
                  )}
                  {actionLabel}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop: horizontal row + progress stepper */}
      <div className="hidden w-full flex-col gap-2.5 md:flex">
        <div
          className={cn(
            "flex w-full items-stretch gap-3",
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

          {(onStatusChange || onMarkReady) && (
            <div
              className={cn(
                "flex shrink-0 items-start gap-2",
                isRtl && "flex-row-reverse",
              )}
            >
              <div
                className={cn(
                  "pointer-events-auto relative z-10 flex flex-col items-end justify-start gap-2 self-start",
                  isRtl && "items-start",
                )}
              >
                {onStatusChange ? (
                  <OrderStatusSelect
                    orderId={order.id}
                    workflowStatus={order.workflowStatus}
                    displayStatus={order.status}
                    userRole={userRole}
                    disabled={statusUpdating}
                    onChange={onStatusChange}
                    context="card"
                    className={controlWidth}
                  />
                ) : (
                  statusBadge
                )}

                <StageWorkerReadout
                  order={order}
                  t={t}
                  isRtl={isRtl}
                  className="hidden md:inline-flex md:max-w-[11rem]"
                />
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

        {progressStepper}
      </div>
      </div>
    </div>
  );
}
