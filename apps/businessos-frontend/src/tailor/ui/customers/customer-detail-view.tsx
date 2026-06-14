"use client";

import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { useCustomerDetailQuery } from "@/tailor/infrastructure/api/hooks/use-customers";
import { CustomerDetailSkeleton } from "@/tailor/ui/skeletons/customer-detail-skeleton";
import { BackLink } from "@/tailor/ui/shared/back-link";
import { routes } from "@/core/config/routes";
import { CustomerAboutPanel } from "@/tailor/ui/customers/customer-about-panel";
import { CustomerDetailHeader } from "@/tailor/ui/customers/customer-detail-header";
import { CustomerOrderHistoryPanel } from "@/tailor/ui/customers/customer-order-history-panel";
import { CustomerSavedMeasurementsCard } from "@/tailor/ui/customers/customer-saved-measurements-card";

interface CustomerDetailViewProps {
  customerId: string;
}

function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString()}`;
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data, isLoading, isError } = useCustomerDetailQuery(customerId);

  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
        {t.common.error}
      </div>
    );
  }

  const { summary, orders } = data;
  const hasOutstanding = summary.outstandingBalance > 0;
  const lastOrderDate = orders[0]?.bookingDate ?? null;

  return (
    <div className="space-y-6">
      <BackLink href={routes.customers} label={t.customers.backToList} isRtl={isRtl} />

      <CustomerDetailHeader data={data} t={t} isRtl={isRtl} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-hairline bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.customers.lifetimeValue}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatRs(summary.lifetimeValue)}
          </p>
        </div>
        <div className="rounded-2xl border border-hairline bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.customers.totalPaid}
          </p>
          <p className="mt-1 text-xl font-bold text-status-ready">
            {formatRs(summary.totalPaid)}
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl border px-4 py-4 shadow-sm",
            hasOutstanding
              ? "border-status-urgent/30 bg-status-urgent-bg"
              : "border-hairline bg-white",
          )}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.customers.outstanding}
          </p>
          <p
            className={cn(
              "mt-1 text-xl font-bold",
              hasOutstanding ? "text-status-urgent" : "text-slate-900",
            )}
          >
            {formatRs(summary.outstandingBalance)}
          </p>
        </div>
        <div className="rounded-2xl border border-hairline bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.customers.lastOrderLabel}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {lastOrderDate ?? "—"}
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
        <CustomerSavedMeasurementsCard data={data} t={t} isRtl={isRtl} />
        <CustomerAboutPanel data={data} t={t} isRtl={isRtl} />
      </div>

      <CustomerOrderHistoryPanel orders={orders} t={t} isRtl={isRtl} />
    </div>
  );
}
