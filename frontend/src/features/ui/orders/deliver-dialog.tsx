"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { getDictionary } from "@/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Select } from "@/core/presentation/components/ui/select";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { DialogContentSkeleton } from "@/features/ui/skeletons";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import {
  useAssignmentsQuery,
  useOrderDetailQuery,
  useUpdateOrderStatusMutation,
} from "@/features/infrastructure/api/hooks/use-orders";

interface DeliverDialogProps {
  orderId: string | null;
  onClose: () => void;
  onDelivered?: () => void;
}

type PaymentMode = "collect" | "unpaid";

export function DeliverDialog({
  orderId,
  onClose,
  onDelivered,
}: DeliverDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);
  const { data: user } = useMeQuery();
  const { data: assignments } = useAssignmentsQuery();
  const updateStatus = useUpdateOrderStatusMutation();
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("collect");
  const [paymentCollected, setPaymentCollected] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const currentUserName = user?.name?.trim() ?? "";

  const collectorOptions = useMemo(() => {
    const names = new Set<string>();
    if (currentUserName) names.add(currentUserName);
    for (const name of assignments?.assignees ?? []) {
      if (name?.trim()) names.add(name.trim());
    }
    return [...names];
  }, [assignments?.assignees, currentUserName]);

  useEffect(() => {
    if (!order) return;
    setPaymentMode("collect");
    setPaymentCollected(order.balanceDue > 0 ? String(order.balanceDue) : "0");
    setCollectedBy(currentUserName);
    setPaymentNote("");
    setError(null);
  }, [order, currentUserName]);

  if (!orderId) return null;

  const isUnpaid = paymentMode === "unpaid";

  async function handleConfirm() {
    if (!orderId) return;
    setError(null);

    const amount = isUnpaid ? "0" : paymentCollected.trim() || "0";

    try {
      await updateStatus.mutateAsync({
        orderId,
        payload: {
          status: "delivered",
          paymentCollected: amount,
          paymentNote: paymentNote.trim() || undefined,
          paymentCollectedByName:
            !isUnpaid && Number(amount) > 0 && collectedBy.trim()
              ? collectedBy.trim()
              : undefined,
        },
      });
      onDelivered?.();
      onClose();
    } catch {
      setError(t.common.error);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 pb-24 sm:items-center sm:pb-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "flex max-h-[min(88vh,calc(100dvh-7rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[85vh]",
          isRtl && "text-right",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4",
            isRtl && "flex-row-reverse",
          )}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t.orderDetail.markDelivered}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t.orderDetail.markDeliveredHint}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && <DialogContentSkeleton />}

          {isError && (
            <p className="py-8 text-center text-sm text-rose-600">
              {t.common.error}
            </p>
          )}

          {order && (
            <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-slate-900">{order.customerName}</p>
              <p className="text-slate-500">
                #{order.orderNumber} · {order.garmentLabel}
              </p>
              <p className="mt-2 font-medium text-slate-700">
                {t.form.balanceDue}: Rs. {order.balanceDue.toLocaleString()}
              </p>
            </div>

            {order.balanceDue > 0 ? (
              <div
                className="grid grid-cols-2 gap-2"
                role="tablist"
                aria-label={t.orderDetail.paymentCollected}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isUnpaid}
                  onClick={() => setPaymentMode("collect")}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                    !isUnpaid
                      ? "border-brand-700 bg-brand-50 text-brand-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {t.orderDetail.collectPaymentNow}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isUnpaid}
                  onClick={() => setPaymentMode("unpaid")}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                    isUnpaid
                      ? "border-amber-400 bg-amber-50 text-amber-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {t.orderDetail.markUnpaid}
                </button>
              </div>
            ) : null}

            {isUnpaid ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {t.orderDetail.unpaidReceivableHint.replace(
                  "{amount}",
                  order.balanceDue.toLocaleString(),
                )}
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="payment-collected">
                    {t.orderDetail.paymentCollected}
                  </Label>
                  <Input
                    id="payment-collected"
                    type="number"
                    min={0}
                    value={paymentCollected}
                    onChange={(e) => setPaymentCollected(e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="collected-by">
                    {t.orderDetail.paymentCollectedBy}
                  </Label>
                  <Select
                    id="collected-by"
                    value={collectedBy}
                    onChange={(e) => setCollectedBy(e.target.value)}
                  >
                    {collectorOptions.length === 0 ? (
                      <option value="">{currentUserName}</option>
                    ) : null}
                    {collectorOptions.map((name) => (
                      <option key={name} value={name}>
                        {name === currentUserName
                          ? t.orderDetail.collectedByYou.replace("{name}", name)
                          : name}
                      </option>
                    ))}
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="payment-note">{t.orderDetail.paymentNote}</Label>
              <Textarea
                id="payment-note"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder={t.orderDetail.paymentNotePlaceholder}
              />
            </div>

            {error && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}
            </div>
          )}
        </div>

        {order && (
          <div
            className={cn(
              "flex shrink-0 gap-2 border-t border-slate-100 bg-white px-5 py-4",
              isRtl && "flex-row-reverse",
            )}
          >
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={updateStatus.isPending}
            >
              {t.form.cancel}
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending
                ? t.orderDetail.confirming
                : t.orderDetail.confirmDelivered}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
