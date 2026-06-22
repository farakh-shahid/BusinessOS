"use client";

import { CheckCircle2, X } from "lucide-react";
import type { Order } from "@shared";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";

interface MarkReadyConfirmSheetProps {
  order: Order | null;
  t: Dictionary;
  isRtl?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function MarkReadyConfirmSheet({
  order,
  t,
  isRtl,
  onCancel,
  onConfirm,
}: MarkReadyConfirmSheetProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-black/40 p-4 pb-24 sm:items-center sm:pb-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-ready-confirm-title"
        className={cn(
          "w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl",
          isRtl && "text-right",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex items-start gap-3",
              isRtl && "flex-row-reverse",
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="mark-ready-confirm-title"
                className="text-base font-bold text-slate-900"
              >
                {t.orders.markReadyConfirmTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t.orders.markReadyConfirmBody
                  .replace("{name}", order.customerName)
                  .replace("{orderNumber}", order.orderNumber)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t.orders.markReadyConfirmHint}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={cn(
            "mt-5 flex gap-2",
            isRtl && "flex-row-reverse",
          )}
        >
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            {t.form.cancel}
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            {t.orders.markReadyContinue}
          </Button>
        </div>
      </div>
    </div>
  );
}
