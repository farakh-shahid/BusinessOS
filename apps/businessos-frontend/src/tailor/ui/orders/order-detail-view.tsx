"use client";

import { useState } from "react";
import Link from "next/link";
import type { OrderFullDetail, OrderWorkflowStatus } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { featureFlags } from "@/core/config/feature-flags";
import { isAdminRole } from "@/core/auth/roles";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import { resolveMediaUrl, dressImageThumbUrl } from "@/tailor/infrastructure/api/upload.api";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import {
  useAssignmentsQuery,
  useOrderDetailQuery,
  useSendReminderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
} from "@/tailor/infrastructure/api/hooks/use-orders";
import { canEditOrderStatus } from "@/tailor/infrastructure/data/order-workflow";
import { phoneTelHref } from "@/tailor/infrastructure/data/order-list-ui";
import { DeliverDialog } from "./deliver-dialog";
import { EditOrderDialog } from "./edit-order-dialog";
import { MarkReadyDialog } from "./mark-ready-dialog";
import { OrderReceiptDialog } from "./order-receipt-dialog";
import { printMeasurementCard } from "./print-order";
import { OrderDetailSkeleton } from "@/tailor/ui/skeletons";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import { BackLink } from "@/tailor/ui/shared/back-link";
import { MeasurementGrid } from "@/tailor/ui/shared/measurement-grid";
import { buildWhatsAppUrl } from "./order-receipt-messages";
import { OrderDetailPanel } from "./order-detail-panel";
import {
  nextWorkflowStage,
  OrderDetailInteractiveStepper,
} from "./order-detail-interactive-stepper";

interface OrderDetailViewProps {
  orderId: string;
}

const WORKFLOW_CHIP: Record<
  OrderWorkflowStatus,
  { wrap: string; dot: string; labelKey: OrderWorkflowStatus }
> = {
  pending: {
    wrap: "bg-status-booked-bg text-status-booked",
    dot: "bg-status-booked",
    labelKey: "pending",
  },
  cutting: {
    wrap: "bg-status-cutting-bg text-[#9c6a10]",
    dot: "bg-status-cutting",
    labelKey: "cutting",
  },
  stitching: {
    wrap: "bg-status-stitching-bg text-status-stitching",
    dot: "bg-status-stitching",
    labelKey: "stitching",
  },
  ready: {
    wrap: "bg-status-ready-bg text-status-ready",
    dot: "bg-status-ready",
    labelKey: "ready",
  },
  delivered: {
    wrap: "bg-status-ready-bg text-status-ready",
    dot: "bg-status-ready",
    labelKey: "delivered",
  },
  cancelled: {
    wrap: "bg-slate-100 text-muted-slate",
    dot: "bg-muted-slate",
    labelKey: "cancelled",
  },
};

function customerInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function InitialsAvatar({
  name,
  size = 54,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-[14px] font-display font-bold text-white",
        getAvatarPaletteClass(name),
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.33) }}
      aria-hidden
    >
      {customerInitials(name)}
    </div>
  );
}

function daysUntilDelivery(dateStr: string): number | null {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(parsed);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function fabricLabel(order: OrderFullDetail, t: ReturnType<typeof getDictionary>): string {
  if (order.fabricNotes?.trim()) return order.fabricNotes.trim();
  return order.fabricSource === "shop" ? t.form.fabricShop : t.form.fabricCustomer;
}

function formatRs(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString()}`;
}

function DetailActionButton({
  children,
  onClick,
  variant = "secondary",
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ready" | "secondary";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12.5px] font-semibold transition disabled:opacity-60",
        variant === "primary" && "bg-accent-500 text-white hover:brightness-105",
        variant === "ready" && "bg-status-ready text-white hover:brightness-105",
        variant === "secondary" &&
          "border border-hairline bg-card text-foreground hover:bg-slate-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);
  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);
  const updateOrder = useUpdateOrderMutation();
  const { data: assignments } = useAssignmentsQuery();
  const updateStatus = useUpdateOrderStatusMutation();
  const sendReminder = useSendReminderMutation();
  const { showError, showSuccess } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [editFocusPayment, setEditFocusPayment] = useState(false);
  const [markReadyOpen, setMarkReadyOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [deliverOpen, setDeliverOpen] = useState(false);

  function openEditDialog(focusPayment = false) {
    setEditFocusPayment(focusPayment);
    setEditOpen(true);
  }

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
        {t.common.error}
      </div>
    );
  }

  const canEdit =
    order.workflowStatus !== "delivered" &&
    order.workflowStatus !== "cancelled";
  const statusEditable = canEditOrderStatus(order.workflowStatus, isAdmin);
  const dressImage = resolveMediaUrl(order.dressImageUrl);
  const dressThumb = dressImageThumbUrl(order.dressImageUrl, 64);
  const measurementItems = Object.entries(order.measurements)
    .filter(([, value]) => value)
    .map(([key, value]) => ({
      label:
        key in t.measurements
          ? t.measurements[key as keyof typeof t.measurements]
          : key,
      value: `${value}"`,
    }));
  const stepperLabels = {
    pending: t.dashboard.workload.booked,
    cutting: t.dashboard.workload.cutting,
    stitching: t.dashboard.workload.stitching,
    ready: t.dashboard.workload.ready,
  } as const;
  const chip = WORKFLOW_CHIP[order.workflowStatus];
  const daysLeft = daysUntilDelivery(order.deliveryDate);
  const nextStage = nextWorkflowStage(order.workflowStatus);
  const unitRate = Math.round(order.totalPrice / Math.max(order.suitCount, 1));
  const paidAmount = order.totalPrice - order.balanceDue;
  const whatsAppUrl = buildWhatsAppUrl(
    order.customerPhone,
    t.customers.whatsAppGreeting.replace("{name}", order.customerName),
  );

  const stepHint =
    order.workflowStatus === "ready"
      ? t.orderDetail.stepHintReady
      : t.orderDetail.stepHint.replace(
          "{stage}",
          t.orderStatus[order.workflowStatus],
        );

  const dueChipLabel =
    order.status === "overdue"
      ? t.orderDetail.dueOverdueChip
      : order.status === "due_today"
        ? t.orderDetail.dueTodayChip
        : daysLeft !== null && daysLeft >= 0
          ? t.orderDetail.dueInDays
              .replace("{date}", order.deliveryDate)
              .replace("{days}", String(daysLeft))
          : order.deliveryDate;

  const deliveryMeta =
    daysLeft === null ? null : daysLeft > 0 ? (
      <span className="font-bold text-status-cutting">
        {t.orderDetail.deliveryInDays.replace("{days}", String(daysLeft))}
      </span>
    ) : daysLeft < 0 ? (
      <span className="font-bold text-status-urgent">
        {t.orderDetail.deliveryOverdueDays.replace(
          "{days}",
          String(Math.abs(daysLeft)),
        )}
      </span>
    ) : null;

  async function handleStatusChange(status: OrderWorkflowStatus) {
    if (status === "delivered" && isAdmin) {
      setDeliverOpen(true);
      return;
    }

    try {
      await updateStatus.mutateAsync({ orderId, payload: { status } });
      showSuccess(t.orders.statusUpdated);
    } catch (err) {
      showError(resolveApiErrorMessage(err, t));
    }
  }

  async function handleReminder() {
    try {
      const result = await sendReminder.mutateAsync(orderId);
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank");
      }
      showSuccess(t.orderDetail.reminderSent);
    } catch (err) {
      showError(resolveApiErrorMessage(err, t));
    }
  }

  async function handleAssignCommit(name: string) {
    try {
      await updateOrder.mutateAsync({
        orderId,
        payload: { assignedToName: name },
      });
      showSuccess(t.orders.assignmentUpdated);
    } catch (err) {
      showError(resolveApiErrorMessage(err, t));
    }
  }

  return (
    <>
      <BackLink
        href={routes.orders}
        label={t.orderDetail.backToOrders}
        isRtl={isRtl}
        className="mb-3"
      />

      <OrderDetailPanel className="mb-3.5">
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-4",
            isRtl && "flex-row-reverse",
          )}
        >
          <div
            className={cn("flex min-w-0 gap-3.5", isRtl && "flex-row-reverse")}
          >
            <div className="relative shrink-0">
              <InitialsAvatar name={order.customerName} />
              {dressThumb ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={dressThumb}
                  alt={order.dressCode ?? t.form.dressImage}
                  title={order.dressCode ?? t.form.dressImage}
                  className="absolute -bottom-1 -right-1 h-9 w-9 rounded-lg object-cover ring-2 ring-white shadow-sm"
                />
              ) : null}
            </div>
            <div className={cn("min-w-0", isRtl && "text-right")}>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-2.5",
                  isRtl && "flex-row-reverse",
                )}
              >
                <h1 className="font-display text-[22px] font-bold leading-tight text-foreground">
                  #{order.orderNumber}
                </h1>
                {order.isRush ? (
                  <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
                    ⚡ {t.orderDetail.rush}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[13px] text-muted-slate">
                {order.garmentLabel} · {order.customerName}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex flex-wrap items-center gap-2",
              isRtl && "flex-row-reverse",
            )}
          >
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                chip.wrap,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", chip.dot)} />
              {t.orderStatus[chip.labelKey]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-status-cutting-bg px-3 py-1.5 text-xs font-semibold text-[#9c6a10]">
              📅 {dueChipLabel}
            </span>
            {order.balanceDue > 0 ? (
              <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600">
                {t.orderDetail.balanceDueChip.replace(
                  "{amount}",
                  order.balanceDue.toLocaleString(),
                )}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "mt-4 flex flex-wrap gap-2 border-t border-hairline pt-4",
            isRtl && "flex-row-reverse",
          )}
        >
          {nextStage && statusEditable ? (
            <DetailActionButton
              variant="primary"
              onClick={() => void handleStatusChange(nextStage)}
              disabled={updateStatus.isPending}
            >
              {t.orderDetail.advanceTo.replace(
                "{stage}",
                stepperLabels[nextStage],
              )}{" "}
              →
            </DetailActionButton>
          ) : null}
          {order.canMarkReady ? (
            <DetailActionButton
              variant="ready"
              onClick={() => setMarkReadyOpen(true)}
            >
              ✓ {t.orders.markReady}
            </DetailActionButton>
          ) : null}
          <DetailActionButton variant="secondary" onClick={() => setReceiptOpen(true)}>
            🧾 {t.receipt.viewReceipt}
          </DetailActionButton>
          <DetailActionButton
            variant="secondary"
            onClick={() => printMeasurementCard(order, t)}
          >
            📐 {t.print.measurements}
          </DetailActionButton>
          <DetailActionButton
            variant="secondary"
            onClick={() => void handleReminder()}
            disabled={sendReminder.isPending}
          >
            💬 {t.orderDetail.sendReminder}
          </DetailActionButton>
          <Link href={routes.customerDetail(order.customerId)}>
            <DetailActionButton variant="secondary">
              👁 {t.orderDetail.customerView}
            </DetailActionButton>
          </Link>
          {canEdit ? (
            <DetailActionButton
              variant="secondary"
              onClick={() => openEditDialog(false)}
            >
              ✏️ {t.orderDetail.editOrder}
            </DetailActionButton>
          ) : null}
        </div>
      </OrderDetailPanel>

      <OrderDetailPanel className="mb-3.5">
        <OrderDetailInteractiveStepper
          workflowStatus={order.workflowStatus}
          labels={stepperLabels}
          hint={stepHint}
          editable={statusEditable && !updateStatus.isPending}
          isRtl={isRtl}
          onStageChange={(stage) => void handleStatusChange(stage)}
        />
      </OrderDetailPanel>

      <div className="grid gap-3.5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="flex flex-col gap-3.5">
          <OrderDetailPanel title={t.orderDetail.items} isRtl={isRtl}>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                    <th className="px-1.5 py-2">{t.orderDetail.tableGarment}</th>
                    <th className="px-1.5 py-2">{t.orderDetail.tableFabric}</th>
                    <th className="px-1.5 py-2 text-center">{t.orderDetail.tableQty}</th>
                    <th className="px-1.5 py-2 text-right">{t.orderDetail.tableRate}</th>
                    <th className="px-1.5 py-2 text-right">{t.orderDetail.tableAmount}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-hairline last:border-b-0">
                    <td className="px-1.5 py-2.5 text-[12.5px] font-bold">
                      {order.garmentLabel}
                    </td>
                    <td className="px-1.5 py-2.5 text-[12.5px]">
                      {fabricLabel(order, t)}
                    </td>
                    <td className="px-1.5 py-2.5 text-center text-[12.5px]">
                      {order.suitCount}
                    </td>
                    <td className="px-1.5 py-2.5 text-right text-[12.5px]">
                      {formatRs(unitRate)}
                    </td>
                    <td className="px-1.5 py-2.5 text-right text-[12.5px] font-semibold">
                      {formatRs(order.totalPrice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </OrderDetailPanel>

          <OrderDetailPanel title={t.orderDetail.orderInfo} isRtl={isRtl}>
            <dl className="space-y-0 text-[12.5px]">
              {[
                [t.form.bookingDate, order.bookingDate],
                [
                  t.form.deliveryDate,
                  <>
                    {order.deliveryDate} {deliveryMeta}
                  </>,
                ],
                [
                  t.orderDetail.priority,
                  order.isRush ? (
                    <span className="text-rose-600">{t.orderDetail.rush}</span>
                  ) : (
                    t.orderDetail.priorityNormal
                  ),
                ],
                [t.form.garmentType, order.garmentLabel],
                ...(order.dressCode
                  ? [[t.form.dressCode, order.dressCode] as const]
                  : []),
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className={cn(
                    "flex justify-between gap-3 border-b border-hairline py-2 last:border-b-0",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <dt className="text-muted-slate">{label}</dt>
                  <dd className="font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </OrderDetailPanel>

          <OrderDetailPanel
            title={t.orderDetail.bodyMeasurements}
            isRtl={isRtl}
            action={
              <button
                type="button"
                onClick={() => printMeasurementCard(order, t)}
                className="text-[11.5px] font-semibold text-accent-500 hover:text-accent-600"
              >
                📐 {t.print.measurements}
              </button>
            }
          >
            <p className="mb-3 text-[11.5px] text-muted-slate">
              {t.orderDetail.measurementsMeta
                .replace("{garment}", order.garmentLabel)
                .replace("{count}", String(measurementItems.length))}
            </p>
            <MeasurementGrid
              items={measurementItems}
              columns={4}
              isRtl={isRtl}
            />
          </OrderDetailPanel>

          {dressImage ? (
            <OrderDetailPanel title={t.form.dressImage} isRtl={isRtl}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dressImage}
                alt={order.dressCode ?? t.form.dressImage}
                className="max-h-64 w-full rounded-xl object-cover ring-1 ring-hairline"
              />
            </OrderDetailPanel>
          ) : null}

          {featureFlags.activityLogEnabled ? (
            <OrderDetailPanel title={t.orderDetail.activity} isRtl={isRtl}>
              {order.auditLog.length === 0 ? (
                <p className="text-sm text-muted-slate">{t.orderDetail.noActivity}</p>
              ) : (
                <div className="relative pl-[18px]">
                  {order.auditLog.map((entry, index) => (
                    <div key={entry.id} className="relative pb-3.5 last:pb-0">
                      <span className="absolute -left-[14px] top-[3px] h-2 w-2 rounded-full bg-accent-500" />
                      {index < order.auditLog.length - 1 ? (
                        <span
                          className="absolute -left-[10.5px] top-[11px] bottom-0 w-px bg-hairline"
                          aria-hidden
                        />
                      ) : null}
                      <p className="text-[12.5px] font-semibold text-foreground">
                        {t.orderDetail.auditActions[entry.action]}
                      </p>
                      <p className="text-[11px] text-muted-slate">
                        {new Date(entry.createdAt).toLocaleString(locale === "ur" ? "ur-PK" : "en-PK")}
                        {entry.userName ? ` · ${entry.userName}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </OrderDetailPanel>
          ) : null}
        </div>

        <div className="flex flex-col gap-3.5">
          <OrderDetailPanel title={t.orderDetail.customerPanel} isRtl={isRtl}>
            <Link
              href={routes.customerDetail(order.customerId)}
              className={cn(
                "mb-3 flex items-center gap-2.5 transition hover:opacity-90",
                isRtl && "flex-row-reverse",
              )}
            >
              <InitialsAvatar name={order.customerName} size={42} className="rounded-[14px]" />
              <div className={cn("min-w-0", isRtl && "text-right")}>
                <p className="text-sm font-bold text-foreground">
                  <PersonNameText name={order.customerName} />
                </p>
                <p className="text-xs text-muted-slate" dir="ltr">
                  {order.customerPhone}
                </p>
              </div>
            </Link>
            <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
              <a
                href={phoneTelHref(order.customerPhone)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-hairline bg-card px-3 py-2 text-[12.5px] font-semibold transition hover:bg-slate-50"
              >
                📞 {t.orderDetail.call}
              </a>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-hairline bg-card px-3 py-2 text-[12.5px] font-semibold transition hover:bg-slate-50"
              >
                💬 {t.customers.whatsApp}
              </a>
            </div>
          </OrderDetailPanel>

          {canEdit ? (
            <OrderDetailPanel title={t.orderDetail.assignedTailor} isRtl={isRtl}>
              <select
                className="w-full rounded-[10px] border border-hairline bg-background px-3 py-2.5 text-[13px] text-foreground"
                value={order.assignedToName ?? ""}
                disabled={updateOrder.isPending}
                onChange={(e) => void handleAssignCommit(e.target.value)}
              >
                <option value="">{t.form.assignedToNone}</option>
                {(assignments?.assignees ?? []).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                {order.assignedToName &&
                !(assignments?.assignees ?? []).includes(order.assignedToName) ? (
                  <option value={order.assignedToName}>{order.assignedToName}</option>
                ) : null}
              </select>
              <p className="mt-2 text-[11px] text-muted-slate">
                {t.orderDetail.assignHint}
              </p>
            </OrderDetailPanel>
          ) : null}

          <OrderDetailPanel title={t.orderDetail.payments} isRtl={isRtl}>
            <div className="mb-3 rounded-[11px] bg-background p-3">
              <div
                className={cn(
                  "flex justify-between gap-3 py-1 text-[12.5px]",
                  isRtl && "flex-row-reverse",
                )}
              >
                <span className="text-muted-slate">{t.form.totalPrice}</span>
                <span className="font-semibold">{formatRs(order.totalPrice)}</span>
              </div>
              <div
                className={cn(
                  "flex justify-between gap-3 py-1 text-[12.5px]",
                  isRtl && "flex-row-reverse",
                )}
              >
                <span className="text-muted-slate">{t.form.advancePaid}</span>
                <span className="font-semibold text-status-ready">
                  {formatRs(paidAmount)}
                </span>
              </div>
              <div
                className={cn(
                  "flex justify-between gap-3 py-1 text-[12.5px]",
                  isRtl && "flex-row-reverse",
                )}
              >
                <span className="text-muted-slate">{t.form.balanceDue}</span>
                <span className="font-semibold text-rose-600">
                  {formatRs(order.balanceDue)}
                </span>
              </div>
            </div>

            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-slate">
              {t.orderDetail.transactions}
            </p>
            {order.payments.length === 0 ? (
              <p className="text-sm text-muted-slate">{t.orderDetail.noPayments}</p>
            ) : (
              <ul>
                {order.payments.map((payment) => (
                  <li
                    key={payment.id}
                    className={cn(
                      "flex items-center justify-between gap-3 border-b border-hairline py-2.5 text-[12.5px] last:border-b-0",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <div className={cn(isRtl && "text-right")}>
                      <p className="font-semibold">
                        {payment.note?.trim() || t.form.advancePaid}
                      </p>
                      <p className="text-[11px] text-muted-slate">
                        {new Date(payment.createdAt).toLocaleDateString(
                          locale === "ur" ? "ur-PK" : "en-PK",
                        )}
                      </p>
                    </div>
                    <span className="font-bold text-status-ready">
                      {formatRs(payment.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {canEdit ? (
              <button
                type="button"
                onClick={() => openEditDialog(true)}
                className="mt-3 inline-flex w-full items-center justify-center rounded-[10px] bg-accent-500 px-3 py-2.5 text-[12.5px] font-semibold text-white transition hover:brightness-105"
              >
                + {t.orderDetail.recordPayment}
              </button>
            ) : null}
          </OrderDetailPanel>
        </div>
      </div>

      <EditOrderDialog
        order={order}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditFocusPayment(false);
        }}
        assigneeSuggestions={assignments?.assignees ?? []}
        focusPayment={editFocusPayment}
      />
      <MarkReadyDialog
        orderId={markReadyOpen ? orderId : null}
        onClose={() => setMarkReadyOpen(false)}
      />
      <OrderReceiptDialog
        orderId={receiptOpen ? orderId : null}
        onClose={() => setReceiptOpen(false)}
      />
      <DeliverDialog
        orderId={deliverOpen ? orderId : null}
        onClose={() => setDeliverOpen(false)}
      />
    </>
  );
}
