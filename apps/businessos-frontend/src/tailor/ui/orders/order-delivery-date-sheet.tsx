"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { BottomSheet } from "@/core/presentation/components/ui/bottom-sheet";
import { Input } from "@/core/presentation/components/ui/input";
import type { OrderListParams } from "@/tailor/infrastructure/data/order-list-params";

interface OrderDeliveryDateSheetProps {
  open: boolean;
  params: OrderListParams;
  t: Dictionary;
  isRtl: boolean;
  onClose: () => void;
  onApply: (dueFrom: string, dueTo: string) => void;
}

export function OrderDeliveryDateSheet({
  open,
  params,
  t,
  isRtl,
  onClose,
  onApply,
}: OrderDeliveryDateSheetProps) {
  const [dueFrom, setDueFrom] = useState(params.dueFrom);
  const [dueTo, setDueTo] = useState(params.dueTo);

  useEffect(() => {
    if (open) {
      setDueFrom(params.dueFrom);
      setDueTo(params.dueTo);
    }
  }, [open, params.dueFrom, params.dueTo]);

  function handleClear() {
    setDueFrom("");
    setDueTo("");
    onApply("", "");
    onClose();
  }

  return (
    <BottomSheet
      open={open}
      title={t.orderList.deliveryDateTitle}
      onClose={onClose}
      isRtl={isRtl}
      footer={
        <div className={cn("flex flex-col gap-2 sm:flex-row", isRtl && "sm:flex-row-reverse")}>
          <button
            type="button"
            onClick={handleClear}
            className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-1"
          >
            {t.orderList.clearDates}
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(dueFrom, dueTo);
              onClose();
            }}
            className="w-full rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800 sm:flex-[2]"
          >
            {t.orderList.applyFilters}
          </button>
        </div>
      }
    >
      <p className={cn("mb-4 text-sm text-muted-slate", isRtl && "text-right")}>
        {t.orderList.deliveryDateHint}
      </p>
      <div className="grid grid-cols-1 gap-4">
        <label className="block min-w-0">
          <span
            className={cn(
              "mb-1.5 block text-sm font-medium text-slate-700",
              isRtl && "text-right",
            )}
          >
            {t.orderList.dueFrom}
          </span>
          <Input
            type="date"
            value={dueFrom}
            onChange={(e) => setDueFrom(e.target.value)}
            className="h-11 w-full min-w-0 bg-white"
          />
        </label>
        <label className="block min-w-0">
          <span
            className={cn(
              "mb-1.5 block text-sm font-medium text-slate-700",
              isRtl && "text-right",
            )}
          >
            {t.orderList.dueTo}
          </span>
          <Input
            type="date"
            value={dueTo}
            min={dueFrom || undefined}
            onChange={(e) => setDueTo(e.target.value)}
            className="h-11 w-full min-w-0 bg-white"
          />
        </label>
      </div>
    </BottomSheet>
  );
}
