"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getDictionary } from "@/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { DialogContentSkeleton } from "@/features/ui/skeletons";
import {
  useOrderDetailQuery,
  useUpdateOrderStatusMutation,
} from "@/features/infrastructure/api/hooks/use-orders";

interface DeliverDialogProps {
  orderId: string | null;
  onClose: () => void;
  onDelivered?: () => void;
}

export function DeliverDialog({
  orderId,
  onClose,
  onDelivered,
}: DeliverDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);
  const updateStatus = useUpdateOrderStatusMutation();
  const [paymentCollected, setPaymentCollected] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;
    setPaymentCollected(
      order.balanceDue > 0 ? String(order.balanceDue) : "0",
    );
    setPaymentNote("");
    setError(null);
  }, [order]);

  if (!orderId) return null;

  async function handleConfirm() {
    if (!orderId) return;
    setError(null);

    try {
      await updateStatus.mutateAsync({
        orderId,
        payload: {
          status: "delivered",
          paymentCollected: paymentCollected.trim() || "0",
          paymentNote: paymentNote.trim() || undefined,
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
