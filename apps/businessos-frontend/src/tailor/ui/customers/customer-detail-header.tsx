"use client";

import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
} from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type { CustomerDetail } from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Card } from "@/core/presentation/components/ui/card";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { buildWhatsAppUrl } from "@/tailor/ui/orders/order-receipt-messages";
import { CustomerStatusChips } from "@/tailor/ui/customers/customer-status-chips";

interface CustomerDetailHeaderProps {
  data: CustomerDetail;
  t: Dictionary;
  isRtl: boolean;
}

export function CustomerDetailHeader({
  data,
  t,
  isRtl,
}: CustomerDetailHeaderProps) {
  const { customer, summary } = data;
  const hasOutstanding = summary.outstandingBalance > 0;
  const whatsAppUrl = buildWhatsAppUrl(
    customer.phone,
    t.customers.whatsAppGreeting.replace("{name}", customer.name),
  );

  return (
    <Card
      className={cn(
        "border-hairline bg-card p-5 md:p-6",
        "max-md:sticky max-md:top-0 max-md:z-30 max-md:border-b max-md:bg-card max-md:shadow-[0_4px_16px_rgba(15,23,42,0.08)]",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-start gap-4",
            isRtl && "flex-row-reverse",
          )}
        >
          <UserAvatar name={customer.name} size="lg" />
          <div className={cn("min-w-0", isRtl && "text-right")}>
            <div
              className={cn(
                "flex flex-wrap items-center gap-2",
                isRtl && "flex-row-reverse justify-end",
              )}
            >
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {customer.name}
              </h1>
              <CustomerStatusChips
                isVip={customer.isVip ?? false}
                totalOrders={summary.totalOrders}
                hasOutstanding={hasOutstanding}
                t={t.customers}
                className={isRtl ? "flex-row-reverse" : undefined}
              />
            </div>
            <div
              className={cn(
                "mt-2 space-y-1 text-sm text-slate-600",
                isRtl && "text-right",
              )}
            >
              <p
                className={cn(
                  "flex items-center gap-1.5",
                  isRtl && "flex-row-reverse justify-end",
                )}
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span dir="ltr">{customer.phone}</span>
              </p>
              {customer.email ? (
                <p
                  className={cn(
                    "flex items-center gap-1.5",
                    isRtl && "flex-row-reverse justify-end",
                  )}
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span dir="ltr">{customer.email}</span>
                </p>
              ) : null}
              <p className="text-slate-500">
                {t.customers.lifetimeOrders.replace(
                  "{count}",
                  String(summary.totalOrders),
                )}
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex shrink-0 flex-wrap gap-2 max-md:grid max-md:w-full max-md:grid-cols-2",
            isRtl && "flex-row-reverse justify-end",
          )}
        >
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 max-md:w-full"
          >
            <Phone className="h-4 w-4" />
            {t.customers.call}
          </a>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 max-md:w-full"
          >
            <MessageCircle className="h-4 w-4" />
            {t.customers.whatsApp}
          </a>
          <Link href={routes.customerEdit(customer.id)} className="max-md:w-full">
            <Button variant="outline" className="gap-2 max-md:w-full">
              <Pencil className="h-4 w-4" />
              {t.customers.editCustomer}
            </Button>
          </Link>
          <Link href={routes.newOrderForCustomer(customer.id)} className="max-md:w-full">
            <Button className="gap-2 max-md:w-full">
              <Plus className="h-4 w-4" />
              {t.search.placeOrderAgain}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
