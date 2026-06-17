"use client";

import { ArrowDownLeft, Receipt } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";

export type ReceivablesTab = "outstanding" | "received";

interface ReceivablesTabSwitcherProps {
  tab: ReceivablesTab;
  t: Dictionary;
  isRtl?: boolean;
  onChange: (tab: ReceivablesTab) => void;
  className?: string;
}

const tabs: {
  value: ReceivablesTab;
  labelKey: "tabOutstanding" | "tabReceived";
  icon: typeof Receipt;
}[] = [
  { value: "outstanding", labelKey: "tabOutstanding", icon: Receipt },
  { value: "received", labelKey: "tabReceived", icon: ArrowDownLeft },
];

export function ReceivablesTabSwitcher({
  tab,
  t,
  isRtl,
  onChange,
  className,
}: ReceivablesTabSwitcherProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-1 rounded-[10px] border border-hairline bg-card p-[3px]",
        className,
      )}
      role="tablist"
      aria-label={t.receivables.title}
    >
      {tabs.map(({ value, labelKey, icon: Icon }) => {
        const active = tab === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[7px] px-2.5 py-2 text-xs font-semibold transition-colors sm:text-sm",
              isRtl && "flex-row-reverse",
              active
                ? "bg-brand-700 text-white"
                : "text-muted-slate hover:bg-slate-50 hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{t.receivables[labelKey]}</span>
          </button>
        );
      })}
    </div>
  );
}
