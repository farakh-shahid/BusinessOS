"use client";

import type { OrderWorkflowStatus } from "@shared";
import { getDictionary } from "@/i18n";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import {
  canEditOrderStatus,
  workflowOptionsForRole,
} from "@/features/infrastructure/data/order-workflow";
import { statusBadgeClass } from "@/features/infrastructure/data/order-status-colors";

interface OrderStatusSelectProps {
  orderId: string;
  workflowStatus: OrderWorkflowStatus;
  displayStatus: string;
  userRole?: string | null;
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
  userRole,
  disabled,
  onChange,
  context = "card",
  className,
}: OrderStatusSelectProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const isCard = context === "card";
  const editable = canEditOrderStatus(workflowStatus, userRole) && !disabled;
  const statusOptions = workflowOptionsForRole(userRole);

  const tone = statusBadgeClass({
    workflowStatus,
    displayStatus,
  });

  if (!editable) {
    const label = t.orderStatus[workflowStatus];
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-lg px-2 py-1 font-bold uppercase tracking-wide",
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
        isCard ? "w-full sm:w-[10rem]" : "w-full sm:w-56",
        className,
      )}
      menuClassName={isCard ? "min-w-[min(100vw-1.5rem,14rem)] sm:min-w-[12rem]" : "min-w-[14rem]"}
      buttonClassName={cn(
        "rounded-lg font-semibold",
        isCard
          ? "min-h-11 text-xs font-bold uppercase tracking-wide sm:min-h-9 sm:py-1.5"
          : "h-10 text-sm normal-case",
        tone,
      )}
      aria-label={t.orders.changeStatus}
    />
  );
}
