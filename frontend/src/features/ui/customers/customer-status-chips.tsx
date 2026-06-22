import { Zap } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

type CustomerStatusChipVariant = "vip" | "regular" | "new" | "balance";

const chipStyles: Record<CustomerStatusChipVariant, string> = {
  vip: "border border-amber-200/80 bg-amber-50 text-amber-800",
  regular: "bg-status-booked-bg text-status-booked",
  new: "bg-slate-100 text-slate-600",
  balance: "bg-status-urgent-bg text-status-urgent",
};

interface CustomerStatusChipProps {
  variant: CustomerStatusChipVariant;
  label: string;
  className?: string;
}

export function CustomerStatusChip({
  variant,
  label,
  className,
}: CustomerStatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em]",
        chipStyles[variant],
        className,
      )}
    >
      {variant === "vip" ? (
        <Zap className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500" aria-hidden />
      ) : null}
      {label}
    </span>
  );
}

interface CustomerStatusChipsProps {
  isVip: boolean;
  totalOrders: number;
  hasOutstanding: boolean;
  showBalanceChip?: boolean;
  t: {
    tagVip: string;
    tagRegular: string;
    tagNewCustomer: string;
    tagHasBalance: string;
  };
  className?: string;
}

export function CustomerStatusChips({
  isVip,
  totalOrders,
  hasOutstanding,
  showBalanceChip = true,
  t,
  className,
}: CustomerStatusChipsProps) {
  const isNew = totalOrders <= 1;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {isVip ? (
        <CustomerStatusChip variant="vip" label={t.tagVip} />
      ) : isNew ? (
        <CustomerStatusChip variant="new" label={t.tagNewCustomer} />
      ) : (
        <CustomerStatusChip variant="regular" label={t.tagRegular} />
      )}
      {showBalanceChip && hasOutstanding ? (
        <CustomerStatusChip variant="balance" label={t.tagHasBalance} />
      ) : null}
    </div>
  );
}
