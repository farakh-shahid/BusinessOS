"use client";

import Link from "next/link";
import { ChevronRight, Mail, Phone } from "lucide-react";
import type { CustomerListEntry } from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { getDictionary } from "@business-os/i18n";

interface CustomerListItemProps {
  customer: CustomerListEntry;
}

function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString()}`;
}

export function CustomerListItem({ customer }: CustomerListItemProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const hasBalance = customer.outstandingBalance > 0;

  return (
    <Link
      href={routes.customerDetail(customer.id)}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[15px] border border-hairline bg-card p-4 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(14,26,54,0.07)] active:scale-[0.995] sm:gap-4 sm:px-[17px] sm:py-[15px]",
        isRtl && "flex-row-reverse text-right",
      )}
    >
      <UserAvatar name={customer.name} size="lg" />

      <div className="min-w-0 flex-1">
        <p className="font-display truncate text-[15px] font-bold text-foreground">
          {customer.name}
        </p>
        <div
          className={cn(
            "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-slate sm:text-sm",
            isRtl && "flex-row-reverse",
          )}
        >
          <span className={cn("inline-flex items-center gap-1", isRtl && "flex-row-reverse")}>
            <Phone className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span dir="ltr">{customer.phone}</span>
          </span>
          {customer.email ? (
            <span className={cn("inline-flex min-w-0 items-center gap-1", isRtl && "flex-row-reverse")}>
              <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate" dir="ltr">
                {customer.email}
              </span>
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "hidden shrink-0 items-center gap-5 text-right sm:flex",
          isRtl && "flex-row-reverse text-left",
        )}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
            {t.customers.ordersShort}
          </p>
          <p className="font-display text-sm font-bold text-foreground">
            {customer.totalOrders}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
            {t.customers.outstanding}
          </p>
          <p
            className={cn(
              "font-display text-sm font-bold",
              hasBalance ? "text-status-urgent" : "text-foreground",
            )}
          >
            {hasBalance ? formatRs(customer.outstandingBalance) : t.customers.settled}
          </p>
        </div>
        {customer.lastOrderDate ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
              {t.customers.lastVisit}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {customer.lastOrderDate}
            </p>
          </div>
        ) : null}
      </div>

      <ChevronRight
        className={cn("h-5 w-5 shrink-0 text-muted-slate/50", isRtl && "rotate-180")}
      />
    </Link>
  );
}
