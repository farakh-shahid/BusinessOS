"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  MessageCircle,
  Printer,
  Save,
} from "lucide-react";
import type { OrderWorkflowStatus } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { isAdminRole } from "@/core/auth/roles";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import { resolveMediaUrl } from "@/tailor/infrastructure/api/upload.api";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import {
  useAssignmentsQuery,
  useOrderDetailQuery,
  useSendReminderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
} from "@/tailor/infrastructure/api/hooks/use-orders";
import { AssignedToInput } from "./assigned-to-input";
import { bookingGarmentOptions } from "@/tailor/infrastructure/data/new-order.mock";
import { DeliverDialog } from "./deliver-dialog";
import { MarkReadyDialog } from "./mark-ready-dialog";
import { OrderStatusSelect } from "./order-status-select";
import { printMeasurementCard, printOrderReceipt } from "./print-order";
import { OrderDetailSkeleton } from "@/tailor/ui/skeletons";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";

interface OrderDetailViewProps {
  orderId: string;
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

  const [editing, setEditing] = useState(false);
  const [markReadyOpen, setMarkReadyOpen] = useState(false);
  const [deliverOpen, setDeliverOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [suitCount, setSuitCount] = useState("1");
  const [garmentType, setGarmentType] = useState("shalwarQameez");
  const [fabricSource, setFabricSource] = useState<"customer" | "shop">(
    "customer",
  );
  const [fabricNotes, setFabricNotes] = useState("");
  const [styleNotes, setStyleNotes] = useState("");
  const [isRush, setIsRush] = useState(false);
  const [assignedToName, setAssignedToName] = useState("");

  function syncEditFields() {
    if (!order) return;
    setDeliveryDate(order.deliveryDate);
    setTotalPrice(String(order.totalPrice));
    setAdvancePaid(String(order.advancePaid));
    setDressCode(order.dressCode ?? "");
    setSuitCount(String(order.suitCount));
    setGarmentType(order.garmentType);
    setFabricSource(order.fabricSource);
    setFabricNotes(order.fabricNotes ?? "");
    setStyleNotes(order.styleNotes ?? "");
    setIsRush(order.isRush);
    setAssignedToName(order.assignedToName ?? "");
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
  const dressImage = resolveMediaUrl(order.dressImageUrl);
  const balance = Math.max(
    (Number(totalPrice) || order.totalPrice) -
      (Number(advancePaid) || order.advancePaid),
    0,
  );

  async function handleStatusChange(
    _orderId: string,
    status: OrderWorkflowStatus,
  ) {
    if (status === "delivered" && isAdmin) {
      setDeliverOpen(true);
      return;
    }

    setError(null);
    try {
      await updateStatus.mutateAsync({
        orderId,
        payload: { status },
      });
      setFeedback(t.orders.statusUpdated);
      showSuccess(t.orders.statusUpdated);
    } catch (err) {
      const msg = resolveApiErrorMessage(err, t);
      setError(msg);
      showError(msg);
    }
  }

  async function handleSave() {
    setError(null);
    setFeedback(null);
    try {
      await updateOrder.mutateAsync({
        orderId,
        payload: {
          deliveryDate,
          totalPrice,
          advancePaid,
          dressCode,
          suitCount,
          garmentType,
          fabricSource,
          fabricNotes,
          styleNotes,
          isRush,
          assignedToName,
        },
      });
      setEditing(false);
      setFeedback(t.orderDetail.saved);
      showSuccess(t.orderDetail.saved);
    } catch (err) {
      const msg = resolveApiErrorMessage(err, t);
      setError(msg);
      showError(msg);
    }
  }

  async function handleReminder() {
    setError(null);
    try {
      const result = await sendReminder.mutateAsync(orderId);
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank");
      }
      setFeedback(t.orderDetail.reminderSent);
      showSuccess(t.orderDetail.reminderSent);
    } catch (err) {
      const msg = resolveApiErrorMessage(err, t);
      setError(msg);
      showError(msg);
    }
  }

  return (
    <>
      <div className="mb-4">
        <Link
          href={routes.orders}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          ← {t.nav.orders}
        </Link>
        <div
          className={cn(
            "mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 gap-3",
              isRtl && "flex-row-reverse",
            )}
          >
            <UserAvatar name={order.customerName} size="lg" />
            <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-2",
                  isRtl && "flex-row-reverse justify-end",
                )}
              >
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  #{order.orderNumber}
                </h2>
                {order.isRush ? (
                  <span className="inline-flex shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold uppercase text-rose-700">
                    {t.orderDetail.rush}
                  </span>
                ) : null}
              </div>

              {order.dressCode ? (
                <div
                  className={cn(
                    "mt-1.5 flex flex-wrap gap-2",
                    isRtl && "justify-end",
                  )}
                >
                  <span className="inline-flex max-w-full items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                    <span className="truncate">
                      {t.form.dressCode}: {order.dressCode}
                    </span>
                  </span>
                </div>
              ) : null}

              {order.assignedToName ? (
                <div
                  className={cn(
                    "mt-1.5 flex flex-wrap gap-2",
                    isRtl && "justify-end",
                  )}
                >
                  <span
                    className="inline-flex max-w-full min-w-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700"
                    title={`${t.form.assignedTo}: ${order.assignedToName}`}
                  >
                    <span className="shrink-0 text-slate-500">
                      {t.form.assignedTo.split("(")[0]?.trim() ?? t.form.assignedTo}:
                    </span>
                    <PersonNameText
                      name={order.assignedToName}
                      className="min-w-0 font-semibold text-slate-700"
                    />
                  </span>
                </div>
              ) : null}

              <p className="mt-2 font-medium text-slate-700">
                {order.customerName}
              </p>
              <p className="text-sm text-slate-500">{order.customerPhone}</p>
            </div>
          </div>
          <OrderStatusSelect
            orderId={orderId}
            workflowStatus={order.workflowStatus}
            displayStatus={order.status}
            isAdmin={isAdmin}
            disabled={updateStatus.isPending}
            onChange={handleStatusChange}
            context="detail"
            className="shrink-0"
          />
        </div>
      </div>

      <div
        className={cn(
          "mb-4 flex flex-wrap gap-2",
          isRtl && "flex-row-reverse",
        )}
      >
        {order.canMarkReady && (
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={() => setMarkReadyOpen(true)}
          >
            <CheckCircle2 className="h-4 w-4" />
            {t.orders.markReady}
          </Button>
        )}
        <Button
          variant="outline"
          className="gap-2 text-sm"
          onClick={handleReminder}
          disabled={sendReminder.isPending}
        >
          <Bell className="h-4 w-4" />
          {t.orderDetail.sendReminder}
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-sm"
          onClick={() => printOrderReceipt(order, t)}
        >
          <Printer className="h-4 w-4" />
          {t.print.receipt}
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-sm"
          onClick={() => printMeasurementCard(order, t)}
        >
          <MessageCircle className="h-4 w-4" />
          {t.print.measurements}
        </Button>
        {canEdit && !editing && (
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => {
              syncEditFields();
              setEditing(true);
            }}
          >
            {t.orderDetail.editOrder}
          </Button>
        )}
      </div>

      {feedback && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {feedback}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>{t.form.orderDetails}</CardTitle>
          {canEdit && !editing ? (
            <div className="mt-4 border-b border-slate-100 pb-4">
              <AssignedToInput
                t={t}
                value={order.assignedToName ?? ""}
                onChange={setAssignedToName}
                onCommit={async (next) => {
                  try {
                    await updateOrder.mutateAsync({
                      orderId,
                      payload: { assignedToName: next },
                    });
                    showSuccess(t.orders.assignmentUpdated);
                  } catch (err) {
                    showError(resolveApiErrorMessage(err, t));
                  }
                }}
                suggestions={assignments?.assignees ?? []}
                isRtl={isRtl}
                disabled={updateOrder.isPending}
              />
            </div>
          ) : null}
          {editing ? (
            <div className="mt-4 space-y-3">
              <AssignedToInput
                t={t}
                value={assignedToName}
                onChange={setAssignedToName}
                suggestions={assignments?.assignees ?? []}
                isRtl={isRtl}
              />
              <div>
                <Label htmlFor="od-garment">{t.form.garmentType}</Label>
                <SearchableCombobox
                  id="od-garment"
                  value={garmentType}
                  onChange={setGarmentType}
                  options={bookingGarmentOptions.map((g) => ({
                    value: g.value,
                    label: t.garments[g.labelKey],
                  }))}
                  placeholder={t.form.selectGarment}
                  emptyMessage={t.form.noOptions}
                  isRtl={isRtl}
                  aria-label={t.form.garmentType}
                />
              </div>
              <div>
                <Label htmlFor="od-dress-code">{t.form.dressCode}</Label>
                <Input
                  id="od-dress-code"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="od-suit-count">{t.form.suitCount}</Label>
                  <Input
                    id="od-suit-count"
                    type="number"
                    min={1}
                    value={suitCount}
                    onChange={(e) => setSuitCount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="od-delivery">{t.form.deliveryDate}</Label>
                  <Input
                    id="od-delivery"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={isRush}
                  onChange={(e) => setIsRush(e.target.checked)}
                />
                {t.orderDetail.rushOrder}
              </label>
              <div>
                <Label htmlFor="od-fabric-notes">{t.form.fabricNotes}</Label>
                <Textarea
                  id="od-fabric-notes"
                  value={fabricNotes}
                  onChange={(e) => setFabricNotes(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="od-style-notes">{t.form.styleNotes}</Label>
                <Textarea
                  id="od-style-notes"
                  value={styleNotes}
                  onChange={(e) => setStyleNotes(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="od-total">{t.form.totalPrice}</Label>
                  <Input
                    id="od-total"
                    type="number"
                    min={0}
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="od-advance">{t.form.advancePaid}</Label>
                  <Input
                    id="od-advance"
                    type="number"
                    min={0}
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-500">
                {t.form.balanceDue}: Rs. {balance.toLocaleString()}
              </p>
              <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={updateOrder.isPending}
                >
                  {t.form.cancel}
                </Button>
                <Button
                  className="gap-2"
                  onClick={handleSave}
                  disabled={updateOrder.isPending}
                >
                  <Save className="h-4 w-4" />
                  {updateOrder.isPending
                    ? t.orderDetail.saving
                    : t.orderDetail.saveChanges}
                </Button>
              </div>
            </div>
          ) : (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t.form.garmentType}</dt>
                <dd className="font-medium text-slate-900">{order.garmentLabel}</dd>
              </div>
              {order.dressCode && (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">{t.form.dressCode}</dt>
                  <dd className="font-medium text-slate-900">{order.dressCode}</dd>
                </div>
              )}
              {!canEdit ? (
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-slate-500">{t.form.assignedTo}</dt>
                  <dd className="min-w-0 text-right font-medium text-slate-900">
                    {order.assignedToName ? (
                      <PersonNameText
                        name={order.assignedToName}
                        className="min-w-0 justify-end"
                      />
                    ) : (
                      t.form.assignedToNone
                    )}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t.form.bookingDate}</dt>
                <dd className="font-medium text-slate-900">{order.bookingDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t.form.deliveryDate}</dt>
                <dd className="font-medium text-slate-900">{order.deliveryDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t.form.totalPrice}</dt>
                <dd className="font-medium text-slate-900">
                  Rs. {order.totalPrice.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t.form.balanceDue}</dt>
                <dd className="font-bold text-slate-900">
                  Rs. {order.balanceDue.toLocaleString()}
                </dd>
              </div>
              {order.fabricNotes && (
                <div>
                  <dt className="text-slate-500">{t.form.fabricNotes}</dt>
                  <dd className="mt-1 text-slate-800">{order.fabricNotes}</dd>
                </div>
              )}
            </dl>
          )}
        </Card>

        {dressImage && (
          <Card>
            <CardTitle>{t.form.dressImage}</CardTitle>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dressImage}
              alt={order.dressCode ?? t.form.dressImage}
              className="mt-4 max-h-64 w-full rounded-xl object-cover ring-1 ring-slate-200"
            />
          </Card>
        )}

        <Card>
          <CardTitle>{t.form.measurements}</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            {order.suitCount > 1
              ? `${order.suitCount} × ${order.garmentLabel}`
              : order.garmentLabel}
            {order.dressCode ? (
              <>
                {" · "}
                <span className="font-medium text-slate-700">
                  {t.form.dressCode}: {order.dressCode}
                </span>
              </>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {t.orderDetail.measurementsSuitHint}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {Object.entries(order.measurements).map(([key, value]) =>
              value ? (
                <div key={key}>
                  <dt className="text-slate-500">
                    {key in t.measurements
                      ? t.measurements[key as keyof typeof t.measurements]
                      : key}
                  </dt>
                  <dd className="font-medium text-slate-900">{value}"</dd>
                </div>
              ) : null,
            )}
          </dl>
        </Card>

        <Card>
          <CardTitle>{t.orderDetail.payments}</CardTitle>
          {order.payments.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              {t.orderDetail.noPayments}
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {order.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      Rs. {payment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {payment.recordedByName} ·{" "}
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {payment.note && (
                    <span className="text-xs text-slate-600">{payment.note}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>{t.orderDetail.activity}</CardTitle>
          {order.auditLog.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{t.orderDetail.noActivity}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {order.auditLog.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl border border-slate-100 px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">
                      {t.orderDetail.auditActions[entry.action]}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{entry.userName}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <MarkReadyDialog
        orderId={markReadyOpen ? orderId : null}
        onClose={() => setMarkReadyOpen(false)}
      />
      <DeliverDialog
        orderId={deliverOpen ? orderId : null}
        onClose={() => setDeliverOpen(false)}
      />
    </>
  );
}
