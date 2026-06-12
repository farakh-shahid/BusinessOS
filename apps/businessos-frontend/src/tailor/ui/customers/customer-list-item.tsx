"use client";

import { ChevronRight, Mail, Phone } from "lucide-react";
import type { TailorCustomer } from "@business-os/tailor";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";

interface CustomerListItemProps {
  customer: TailorCustomer;
  onSelect: (customerId: string) => void;
}

export function CustomerListItem({ customer, onSelect }: CustomerListItemProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";

  return (
    <button
      type="button"
      onClick={() => onSelect(customer.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md active:scale-[0.99]",
        isRtl && "flex-row-reverse text-right",
      )}
    >
      <UserAvatar name={customer.name} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">{customer.name}</p>
        <div
          className={cn(
            "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600",
            isRtl && "flex-row-reverse",
          )}
        >
          <span className={cn("inline-flex items-center gap-1", isRtl && "flex-row-reverse")}>
            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span dir="ltr">{customer.phone}</span>
          </span>
          {customer.email && (
            <span className={cn("inline-flex items-center gap-1", isRtl && "flex-row-reverse")}>
              <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate" dir="ltr">
                {customer.email}
              </span>
            </span>
          )}
        </div>
      </div>

      <ChevronRight
        className={cn("h-5 w-5 shrink-0 text-slate-300", isRtl && "rotate-180")}
      />
    </button>
  );
}
