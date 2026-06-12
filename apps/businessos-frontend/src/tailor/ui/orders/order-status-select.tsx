"use client";

import type { OrderWorkflowStatus } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import {
  canEditOrderStatus,
  workflowOptionsForRole,
} from "@/tailor/infrastructure/data/order-workflow";

const badgeTone: Record<OrderWorkflowStatus, string> = {
  pending: "border-slate-200 bg-slate-50 text-slate-700",
  cutting: "border-sky-200 bg-sky-50 text-sky-800",
  stitching: "border-brand-200 bg-brand-50 text-brand-800",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  delivered: "border-indigo-200 bg-indigo-50 text-indigo-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

interface OrderStatusSelectProps {
  orderId: string;
  workflowStatus: OrderWorkflowStatus;
  displayStatus: string;
  isAdmin: boolean;
  disabled?: boolean;
  onChange: (orderId: string, status: OrderWorkflowStatus) => void;
  /** `card` = narrow badge on order rows; `detail` = full-width on order detail header */
  context?: "card" | "detail";
  className?: string;
}

export function OrderStatusSelect({
  orderId,
  workflowStatus,
  displayStatus,
  isAdmin,
  disabled,
  onChange,
  context = "card",
  className,
}: OrderStatusSelectProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const isCard = context === "card";
  const editable = canEditOrderStatus(workflowStatus, isAdmin) && !disabled;
  const statusOptions = workflowOptionsForRole(isAdmin);

  const tone =
    workflowStatus === "pending" &&
    (displayStatus === "overdue" || displayStatus === "due_today")
      ? displayStatus === "overdue"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-amber-200 bg-amber-50 text-amber-800"
      : badgeTone[workflowStatus];

  if (!editable) {
    const label = t.orderStatus[workflowStatus];
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-lg border px-2 py-1 font-bold uppercase tracking-wide",
          isCard
            ? "max-w-[9rem] text-[10px]"
            : "text-xs sm:text-sm sm:normal-case",
          tone,
          className,
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <SearchableCombobox
      value={workflowStatus}
      onChange={(status) =>
        onChange(orderId, status as OrderWorkflowStatus)
      }
      options={statusOptions.map((status) => ({
        value: status,
        label: t.orderStatus[status],
      }))}
      placeholder={t.orders.changeStatus}
      emptyMessage={t.form.noOptions}
      disabled={disabled}
      variant={isCard ? "compact" : "default"}
      isRtl={isRtl}
      stopClickPropagation
      searchMinOptions={8}
      className={cn(
        isCard ? "w-[10rem]" : "w-full sm:w-56",
        className,
      )}
      menuClassName={isCard ? "min-w-[12rem]" : "min-w-[14rem]"}
      buttonClassName={cn(
        "rounded-lg font-semibold",
        isCard
          ? "text-[10px] font-bold uppercase tracking-wide"
          : "h-10 text-sm normal-case",
        tone,
      )}
      aria-label={t.orders.changeStatus}
    />
  );
}
