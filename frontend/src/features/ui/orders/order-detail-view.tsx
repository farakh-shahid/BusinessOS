"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Pencil,
  Receipt,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import type { OrderFullDetail, OrderWorkflowStatus } from "@shared";
import { getDictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { featureFlags } from "@/core/config/feature-flags";
import { isAdminRole, canChangeOrderStatus, canDeliverOrders } from "@/core/auth/roles";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import { resolveMediaUrl, dressImageThumbUrl } from "@/features/infrastructure/api/upload.api";
import {
  useAssignmentsQuery,
  useOrderDetailQuery,
  useSendReminderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
} from "@/features/infrastructure/api/hooks/use-orders";
import {
  getOrderCardSurfaceClass,
  phoneTelHref,
} from "@/features/infrastructure/data/order-list-ui";
import {
  buildAssigneeWorkloadMap,
} from "@/features/infrastructure/data/assignee-workload";
import { ProductionTeamPanel } from "@/features/ui/orders/production-team-panel";
import {
  ProductionMasterPromptDialog,
  type MasterAssignmentResult,
} from "@/features/ui/orders/production-master-prompt-dialog";
import { EditOrderDialog } from "./edit-order-dialog";
import { DeliverDialog } from "./deliver-dialog";
import { OrderDetailHeader } from "./order-detail-header";
import { ReopenOrderStatusDialog } from "./reopen-order-status-dialog";
import { needsDeliveredReopenConfirm } from "@/features/infrastructure/data/order-workflow";
import { OrderReceiptDialog } from "./order-receipt-dialog";
import { MeasurementCardDialog } from "./measurement-card-dialog";
import { measurementCardDataFromOrder } from "./measurement-card-data";
import { OrderDetailSkeleton } from "@/features/ui/skeletons";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import { BackLink } from "@/features/ui/shared/back-link";
import { GroupedMeasurementGrid } from "@/features/ui/shared/grouped-measurement-grid";
import { useWhatsAppTextAction } from "@/features/infrastructure/api/hooks/use-whatsapp";
import { OrderDetailPanel } from "./order-detail-panel";

interface OrderDetailViewProps {
  orderId: string;
}

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

function formatDetailDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === "ur" ? "ur-PK" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function findStatusChangeDate(
  auditLog: OrderFullDetail["auditLog"],
  status: OrderWorkflowStatus,
): string | null {
  for (let i = auditLog.length - 1; i >= 0; i -= 1) {
    const entry = auditLog[i];
    if (entry.action !== "STATUS_CHANGED") continue;
    const to = (entry.details as { to?: string })?.to;
    if (to === status) return entry.createdAt;
  }
  return null;
}

function OrderQuickAction({
  icon: Icon,
  label,
  onClick,
  disabled,
  href,
  isRtl,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  isRtl?: boolean;
}) {
  const className = cn(
    "flex items-center gap-2.5 rounded-xl border border-hairline bg-card px-3 py-3 text-left transition-all",
    "hover:border-brand-200 hover:bg-brand-50/70 hover:shadow-sm",
    "active:scale-[0.98] active:bg-brand-50",
    "disabled:pointer-events-none disabled:opacity-60",
    isRtl && "flex-row-reverse text-right",
  );
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 text-[12px] font-semibold leading-snug text-foreground sm:text-[13px]">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);
  const canDeliver = canDeliverOrders(user?.role);
  const canChangeStatus = canChangeOrderStatus(user?.role);
  const updateOrder = useUpdateOrderMutation();
  const updateStatus = useUpdateOrderStatusMutation();
  const { data: assignments } = useAssignmentsQuery();
  const assigneeWorkload = useMemo(
    () => buildAssigneeWorkloadMap(assignments),
    [assignments],
  );
  const sendReminder = useSendReminderMutation();
  const { showError, showSuccess, showToast } = useToast();
  const { send: sendWhatsApp, sending: sendingWhatsApp } = useWhatsAppTextAction();

  const [editOpen, setEditOpen] = useState(false);
  const [editFocusPayment, setEditFocusPayment] = useState(false);
  const [deliverOrderId, setDeliverOrderId] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [masterPrompt, setMasterPrompt] = useState<{
    orderId: string;
    status: OrderWorkflowStatus;
    mode: "cutting" | "stitching" | "finalize";
  } | null>(null);
  const [reopenConfirm, setReopenConfirm] = useState<OrderWorkflowStatus | null>(
    null,
  );

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
  const canManageOrder = canEdit && isAdmin;
  const isCancelled = order.workflowStatus === "cancelled";
  const cancelledAt = isCancelled
    ? findStatusChangeDate(order.auditLog, "cancelled")
    : null;
  const dressImage = resolveMediaUrl(order.dressImageUrl);
  const dressThumb = dressImageThumbUrl(order.dressImageUrl, 64);
  const filledMeasurementCount = Object.values(order.measurements).filter(
    (value) => value !== undefined && value !== null && String(value).trim(),
  ).length;
  const daysLeft = daysUntilDelivery(order.deliveryDate);
  const unitRate = Math.round(order.totalPrice / Math.max(order.suitCount, 1));
  const paidAmount = order.totalPrice - order.balanceDue;

  const cardSurfaceClass = getOrderCardSurfaceClass(order);

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

  async function handleReminder() {
    try {
      const result = await sendReminder.mutateAsync(orderId);
      if (!result.sent && result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
        showToast(t.receipt.whatsappOpened, "info");
        return;
      }
      showSuccess(
        result.sent ? t.orderDetail.reminderSent : t.receipt.whatsappOpened,
      );
    } catch (err) {
      showError(resolveApiErrorMessage(err, t));
    }
  }

  async function handleProductionTeamUpdate(payload: {
    cuttingMasterName?: string;
    stitchingMasterName?: string;
  }) {
    try {
      await updateOrder.mutateAsync({ orderId, payload });
      showSuccess(t.orders.assignmentUpdated);
    } catch (err) {
      showError(resolveApiErrorMessage(err, t));
    }
  }

  async function commitStatusChange(
    targetOrderId: string,
    status: OrderWorkflowStatus,
    masters?: { cuttingMasterName?: string; stitchingMasterName?: string },
  ) {
    setStatusUpdating(true);
    try {
      await updateStatus.mutateAsync({
        orderId: targetOrderId,
        payload: { status, ...masters },
      });
    } catch (err) {
      showError(resolveApiErrorMessage(err, t));
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleStatusChange(
    targetOrderId: string,
    status: OrderWorkflowStatus,
  ) {
    if (!order) return;

    if (needsDeliveredReopenConfirm(order.workflowStatus, status)) {
      setReopenConfirm(status);
      return;
    }

    if (
      canManageOrder &&
      (status === "ready" || status === "delivered") &&
      (!order.cuttingMasterName?.trim() || !order.stitchingMasterName?.trim())
    ) {
      setMasterPrompt({ orderId: targetOrderId, status, mode: "finalize" });
      return;
    }

    await proceedStatusChange(targetOrderId, status);
  }

  async function handleFinalizeMasters(
    targetOrderId: string,
    status: OrderWorkflowStatus,
    result: MasterAssignmentResult,
  ) {
    const payload: MasterAssignmentResult = {};
    if (result.cuttingMasterName?.trim()) {
      payload.cuttingMasterName = result.cuttingMasterName.trim();
    }
    if (result.stitchingMasterName?.trim()) {
      payload.stitchingMasterName = result.stitchingMasterName.trim();
    }

    if (Object.keys(payload).length > 0) {
      try {
        await updateOrder.mutateAsync({ orderId: targetOrderId, payload });
      } catch (err) {
        showError(resolveApiErrorMessage(err, t));
        return;
      }
    }

    await proceedStatusChange(targetOrderId, status);
  }

  async function proceedStatusChange(
    targetOrderId: string,
    status: OrderWorkflowStatus,
  ) {
    if (!order) return;

    if (status === "delivered" && canDeliver) {
      setDeliverOrderId(targetOrderId);
      return;
    }

    if (
      canManageOrder &&
      status === "cutting" &&
      !order.cuttingMasterName?.trim()
    ) {
      setMasterPrompt({ orderId: targetOrderId, status, mode: "cutting" });
      return;
    }

    if (
      canManageOrder &&
      status === "stitching" &&
      !order.stitchingMasterName?.trim()
    ) {
      setMasterPrompt({ orderId: targetOrderId, status, mode: "stitching" });
      return;
    }

    await commitStatusChange(targetOrderId, status);
  }

  async function handleConfirmReopen() {
    if (!order || !reopenConfirm) return;
    const status = reopenConfirm;
    setReopenConfirm(null);
    await commitStatusChange(order.id, status);
  }

  return (
    <>
      <BackLink
        href={routes.orders}
        label={t.orderDetail.backToOrders}
        isRtl={isRtl}
        className="mb-3"
      />

      <div className="flex flex-col gap-3.5 pb-24 md:pb-0">
        <OrderDetailHeader
          order={order}
          t={t}
          isRtl={isRtl}
          locale={locale}
          dressThumb={dressThumb}
          cardSurfaceClass={cardSurfaceClass}
          isCancelled={isCancelled}
          cancelledAt={cancelledAt}
          isAdmin={isAdmin}
          canChangeStatus={canChangeStatus}
          statusUpdating={statusUpdating}
          userRole={user?.role}
          onStatusChange={handleStatusChange}
        />

        <OrderDetailPanel title={t.orderDetail.productionProgress} isRtl={isRtl}>
          <ProductionTeamPanel
            order={order}
            assignees={assignments?.assignees ?? []}
            assigneeWorkload={assigneeWorkload}
            editable={canManageOrder}
            disabled={updateOrder.isPending}
            onUpdate={(payload) => void handleProductionTeamUpdate(payload)}
            t={t}
            isRtl={isRtl}
          />
        </OrderDetailPanel>

        <OrderDetailPanel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {isAdmin ? (
              <OrderQuickAction
                icon={Receipt}
                label={t.orderDetail.quickReceipt}
                onClick={() => setReceiptOpen(true)}
                isRtl={isRtl}
              />
            ) : null}
            <OrderQuickAction
              icon={Ruler}
              label={t.orderDetail.viewMeasurementCard}
              onClick={() => setMeasurementOpen(true)}
              isRtl={isRtl}
            />
            <OrderQuickAction
              icon={MessageCircle}
              label={t.orderDetail.quickReminder}
              onClick={() => void handleReminder()}
              disabled={sendReminder.isPending}
              isRtl={isRtl}
            />
            {canManageOrder ? (
              <OrderQuickAction
                icon={Pencil}
                label={t.orderDetail.quickEdit}
                onClick={() => openEditDialog(false)}
                isRtl={isRtl}
              />
            ) : null}
          </div>
        </OrderDetailPanel>

        <div className="grid gap-3.5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="flex flex-col gap-3.5">
          <OrderDetailPanel title={t.orderDetail.items} isRtl={isRtl}>
            <div className="space-y-2 md:hidden">
              <div className="rounded-xl border border-hairline bg-background p-3">
                <div
                  className={cn(
                    "grid grid-cols-2 gap-x-3 gap-y-2 text-[12.5px]",
                    isRtl && "text-right",
                  )}
                >
                  <div className="col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                      {t.orderDetail.tableGarment}
                    </p>
                    <p className="font-bold text-foreground">{order.garmentLabel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                      {t.orderDetail.tableFabric}
                    </p>
                    <p className="text-foreground">{fabricLabel(order, t)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                      {t.orderDetail.tableQty}
                    </p>
                    <p className="font-semibold text-foreground">{order.suitCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                      {t.orderDetail.tableRate}
                    </p>
                    <p className="text-foreground">
                      {isAdmin ? formatRs(unitRate) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                      {t.orderDetail.tableAmount}
                    </p>
                    <p className="font-semibold text-foreground">
                      {isAdmin ? formatRs(order.totalPrice) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mx-1 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
                    <th className="px-1.5 py-2">{t.orderDetail.tableGarment}</th>
                    <th className="px-1.5 py-2">{t.orderDetail.tableFabric}</th>
                    <th className="px-1.5 py-2 text-center">{t.orderDetail.tableQty}</th>
                    {isAdmin ? (
                      <>
                        <th className="px-1.5 py-2 text-right">{t.orderDetail.tableRate}</th>
                        <th className="px-1.5 py-2 text-right">{t.orderDetail.tableAmount}</th>
                      </>
                    ) : null}
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
                    {isAdmin ? (
                      <>
                        <td className="px-1.5 py-2.5 text-right text-[12.5px]">
                          {formatRs(unitRate)}
                        </td>
                        <td className="px-1.5 py-2.5 text-right text-[12.5px] font-semibold">
                          {formatRs(order.totalPrice)}
                        </td>
                      </>
                    ) : null}
                  </tr>
                </tbody>
              </table>
            </div>
          </OrderDetailPanel>

          <OrderDetailPanel title={t.orderDetail.orderInfo} isRtl={isRtl}>
            <dl className="space-y-0 text-[12.5px]">
              {[
                [
                  t.orderDetail.bookedBy,
                  order.bookedByName?.trim() ? (
                    <PersonNameText name={order.bookedByName} />
                  ) : (
                    "—"
                  ),
                ],
                [t.form.bookingDate, order.bookingDate],
                [
                  t.form.deliveryDate,
                  <>
                    {order.deliveryDate} {deliveryMeta}
                  </>,
                ],
                [
                  t.orderDetail.priority,
                  isCancelled ? (
                    t.orderStatus.cancelled
                  ) : order.isRush ? (
                    <span className="text-rose-600">{t.orderDetail.rush}</span>
                  ) : (
                    t.orderDetail.priorityNormal
                  ),
                ],
                [t.form.garmentType, order.garmentLabel],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className={cn(
                    "flex flex-col gap-0.5 border-b border-hairline py-2.5 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-3",
                    isRtl && "sm:flex-row-reverse",
                  )}
                >
                  <dt className="shrink-0 text-muted-slate">{label}</dt>
                  <dd
                    className={cn(
                      "font-semibold text-foreground sm:text-right",
                      isRtl && "sm:text-left",
                    )}
                  >
                    {value}
                  </dd>
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
                onClick={() => setMeasurementOpen(true)}
                className="text-[11.5px] font-semibold text-accent-500 hover:text-accent-600"
              >
                {t.receipt.viewMeasurementCard}
              </button>
            }
          >
            <p className="mb-3 text-[11.5px] text-muted-slate">
              {t.orderDetail.measurementsMeta
                .replace("{garment}", order.garmentLabel)
                .replace("{count}", String(filledMeasurementCount))}
            </p>
            <GroupedMeasurementGrid
              garmentType={order.garmentType}
              measurements={order.measurements}
              t={t}
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
            {isAdmin ? (
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
            ) : (
              <div
                className={cn(
                  "mb-3 flex items-center gap-2.5",
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
              </div>
            )}
            <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
              <a
                href={phoneTelHref(order.customerPhone)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-hairline bg-card px-3 py-2 text-[12.5px] font-semibold transition hover:bg-slate-50"
              >
                📞 {t.orderDetail.call}
              </a>
              <button
                type="button"
                disabled={sendingWhatsApp}
                onClick={() =>
                  void sendWhatsApp({
                    phone: order.customerPhone,
                    message: t.customers.whatsAppGreeting.replace(
                      "{name}",
                      order.customerName,
                    ),
                    t,
                  })
                }
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-hairline bg-card px-3 py-2 text-[12.5px] font-semibold transition hover:bg-slate-50 disabled:opacity-60"
              >
                💬 {t.customers.whatsApp}
              </button>
            </div>
          </OrderDetailPanel>

          {isAdmin ? (
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
            {order.payments.length > 0 ? (
              <ul>
                {order.payments.map((payment) => (
                  <li
                    key={payment.id}
                    className={cn(
                      "flex items-center justify-between gap-3 border-b border-hairline py-2.5 text-[12.5px] last:border-b-0",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                      <p className="font-semibold">
                        {payment.note?.trim() || t.form.advancePaid}
                      </p>
                      <p className="text-[11px] text-muted-slate">
                        {formatDetailDate(payment.createdAt, locale)}
                      </p>
                    </div>
                    <span className="font-bold text-status-ready">
                      {formatRs(payment.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : paidAmount > 0 ? (
              <div className="space-y-2 rounded-[11px] border border-hairline bg-background p-3 text-[12.5px]">
                <div
                  className={cn(
                    "flex justify-between gap-3",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <span className="text-muted-slate">
                    {t.orderDetail.advancePaymentRecorded}
                  </span>
                  <span className="font-semibold text-status-ready">
                    {formatRs(paidAmount)}
                  </span>
                </div>
                {order.balanceDue > 0 ? (
                  <div
                    className={cn(
                      "flex justify-between gap-3",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <span className="text-muted-slate">
                      {t.orderDetail.remainingBalance}
                    </span>
                    <span className="font-semibold text-rose-600">
                      {formatRs(order.balanceDue)}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-muted-slate">{t.orderDetail.noPayments}</p>
            )}

            {canManageOrder ? (
              <button
                type="button"
                onClick={() => openEditDialog(true)}
                className="mt-3 inline-flex w-full items-center justify-center rounded-[10px] bg-accent-500 px-3 py-3 text-[12.5px] font-semibold text-white transition hover:brightness-105 sm:py-2.5"
              >
                + {t.orderDetail.recordPayment}
              </button>
            ) : null}
          </OrderDetailPanel>
          ) : null}
        </div>
        </div>
      </div>

      {isAdmin ? (
      <EditOrderDialog
        order={order}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditFocusPayment(false);
        }}
        assigneeSuggestions={assignments?.assignees ?? []}
        assigneeWorkload={assigneeWorkload}
        focusPayment={editFocusPayment}
      />
      ) : null}
      <DeliverDialog
        orderId={deliverOrderId}
        onClose={() => setDeliverOrderId(null)}
      />
      <ReopenOrderStatusDialog
        orderNumber={reopenConfirm ? order.orderNumber : null}
        targetStatus={reopenConfirm}
        isPending={statusUpdating}
        onClose={() => setReopenConfirm(null)}
        onConfirm={() => void handleConfirmReopen()}
      />
      <OrderReceiptDialog
        orderId={receiptOpen ? orderId : null}
        onClose={() => setReceiptOpen(false)}
      />
      <MeasurementCardDialog
        data={measurementOpen ? measurementCardDataFromOrder(order) : null}
        onClose={() => setMeasurementOpen(false)}
      />
      <ProductionMasterPromptDialog
        open={masterPrompt !== null}
        stage={masterPrompt?.mode ?? "cutting"}
        assignees={assignments?.assignees ?? []}
        assigneeWorkload={assigneeWorkload}
        defaultCuttingMaster={order.cuttingMasterName}
        defaultStitchingMaster={order.stitchingMasterName}
        disabled={statusUpdating}
        onClose={() => setMasterPrompt(null)}
        onSkip={() => {
          if (!masterPrompt) return;
          const { orderId: targetId, status, mode } = masterPrompt;
          setMasterPrompt(null);
          if (mode === "finalize") {
            void proceedStatusChange(targetId, status);
          } else {
            void commitStatusChange(targetId, status);
          }
        }}
        onConfirm={(result) => {
          if (!masterPrompt) return;
          const { orderId: targetId, status, mode } = masterPrompt;
          setMasterPrompt(null);
          if (mode === "finalize") {
            void handleFinalizeMasters(targetId, status, result);
          } else {
            void commitStatusChange(targetId, status, result);
          }
        }}
        t={t}
        isRtl={isRtl}
      />
    </>
  );
}
