"use client";

import { X } from "lucide-react";
import type { OrderWorkflowStatus } from "@shared";
import { getDictionary } from "@/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";

interface ReopenOrderStatusDialogProps {
  orderNumber: string | null;
  targetStatus: OrderWorkflowStatus | null;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReopenOrderStatusDialog({
  orderNumber,
  targetStatus,
  isPending,
  onClose,
  onConfirm,
}: ReopenOrderStatusDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  if (!orderNumber || !targetStatus) return null;

  const statusLabel = t.orderStatus[targetStatus];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 pb-24 sm:items-center sm:pb-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reopen-order-status-title"
        className={cn(
          "w-full max-w-md rounded-2xl bg-white p-5 shadow-xl",
          isRtl && "text-right",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "mb-4 flex items-start justify-between gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <div>
            <h2
              id="reopen-order-status-title"
              className="text-lg font-bold text-slate-900"
            >
              {t.orders.reopenDeliveredTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t.orders.reopenDeliveredMessage
                .replace("{orderNumber}", orderNumber)
                .replace("{status}", statusLabel)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isPending}
            onClick={onClose}
          >
            {t.form.cancel}
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? t.common.loading : t.orders.reopenDeliveredConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
}
