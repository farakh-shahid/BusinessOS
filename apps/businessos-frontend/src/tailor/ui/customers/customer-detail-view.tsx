"use client";

import Link from "next/link";
import {
  Mail,
  Pencil,
  Phone,
  Plus,
  Shirt,
} from "lucide-react";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
  type TailorMeasurement,
} from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { useLocale } from "@/core/i18n/locale-context";
import { useCustomerDetailQuery } from "@/tailor/infrastructure/api/hooks/use-customers";
import { statusStripeClass } from "@/tailor/infrastructure/data/order-status-colors";
import { CustomerDetailSkeleton } from "@/tailor/ui/skeletons/customer-detail-skeleton";
import { BackLink } from "@/tailor/ui/shared/back-link";
import { MeasurementGrid } from "@/tailor/ui/shared/measurement-grid";

interface CustomerDetailViewProps {
  customerId: string;
}

function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString()}`;
}

function MeasurementSummary({
  measurement,
  t,
  isRtl,
}: {
  measurement: TailorMeasurement;
  t: ReturnType<typeof getDictionary>;
  isRtl: boolean;
}) {
  const garment = measurement.garmentType
    ? normalizeBookingGarmentType(measurement.garmentType)
    : null;

  if (!garment) {
    return (
      <p className="text-sm text-slate-500">{t.customers.noMeasurements}</p>
    );
  }

  const schema = getGarmentSchema(garment);
  const garmentLabel =
    (t.garments as Record<string, string>)[garment] ?? garment;

  const parts = schema.measurementFields
    .map((field) => {
      const value = measurement.measurements[field.key];
      if (value === undefined || value === null) return null;
      const label =
        (t.measurements as Record<string, string>)[field.labelKey] ??
        field.labelKey;
      return { label, value: `${value}"` };
    })
    .filter(Boolean) as Array<{ label: string; value: string }>;

  if (parts.length === 0) {
    return (
      <p className="text-sm text-muted-slate">{t.customers.noMeasurements}</p>
    );
  }

  return (
    <div className={cn(isRtl && "text-right")}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-slate">
        {garmentLabel}
      </p>
      <div className="mt-3">
        <MeasurementGrid items={parts} isRtl={isRtl} />
      </div>
    </div>
  );
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

  const { customer, summary, orders, latestMeasurement } = data;
  const hasOutstanding = summary.outstandingBalance > 0;

  return (
    <div className="space-y-6">
      <BackLink href={routes.customers} label={t.customers.backToList} isRtl={isRtl} />

      <Card className="border-hairline bg-card p-5 md:p-6">
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
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {customer.name}
              </h1>
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
              "flex shrink-0 flex-col gap-2 sm:flex-row",
              isRtl && "sm:flex-row-reverse",
            )}
          >
            <Link href={routes.newOrderForCustomer(customer.id)}>
              <Button className="w-full gap-2 sm:w-auto">
                <Plus className="h-4 w-4" />
                {t.search.placeOrderAgain}
              </Button>
            </Link>
            <Link href={routes.customerEdit(customer.id)}>
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                <Pencil className="h-4 w-4" />
                {t.customers.editCustomer}
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
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
      </div>

      <Card className="border-hairline">
        <CardTitle>{t.customers.savedMeasurements}</CardTitle>
        <div className="mt-4">
          {latestMeasurement ? (
            <MeasurementSummary
              measurement={latestMeasurement}
              t={t}
              isRtl={isRtl}
            />
          ) : (
            <p className="text-sm text-slate-500">{t.customers.noMeasurements}</p>
          )}
        </div>
      </Card>

      <Card className="border-hairline">
        <CardTitle>{t.search.orderHistory}</CardTitle>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t.customers.noOrders}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => {
              const settled = order.balanceDue <= 0;
              return (
                <li key={order.id}>
                  <Link
                    href={routes.orderDetail(order.id)}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl border border-hairline bg-background p-4 transition hover:border-brand-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between",
                      statusStripeClass(
                        { workflowStatus: order.workflowStatus },
                        isRtl,
                      ),
                      isRtl && "sm:flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "min-w-0 flex-1",
                        isRtl && "text-right",
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-2",
                          isRtl && "flex-row-reverse justify-end",
                        )}
                      >
                        <p className="font-semibold text-slate-900">
                          #{order.orderNumber}
                        </p>
                        <Badge variant={order.status}>
                          {t.status[order.status]}
                        </Badge>
                      </div>
                      <p
                        className={cn(
                          "mt-1 flex items-center gap-1.5 text-sm text-slate-600",
                          isRtl && "flex-row-reverse justify-end",
                        )}
                      >
                        <Shirt className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {order.garmentLabel}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {t.form.bookingDate}: {order.bookingDate} ·{" "}
                        {t.form.deliveryDate}: {order.deliveryDate}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "flex flex-wrap items-center gap-3 sm:shrink-0",
                        isRtl && "flex-row-reverse justify-end",
                      )}
                    >
                      <div className={cn(isRtl && "text-left")}>
                        <p className="text-xs text-slate-500">{t.form.totalPrice}</p>
                        <p className="font-semibold text-slate-900">
                          {formatRs(order.totalPrice)}
                        </p>
                      </div>
                      <div className={cn(isRtl && "text-left")}>
                        <p className="text-xs text-slate-500">{t.form.advancePaid}</p>
                        <p className="font-semibold text-slate-700">
                          {formatRs(order.advancePaid)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          settled
                            ? "bg-status-ready-bg text-status-ready"
                            : "bg-status-urgent-bg text-status-urgent",
                        )}
                      >
                        {settled
                          ? t.customers.settled
                          : t.customers.amountDue.replace(
                              "{amount}",
                              order.balanceDue.toLocaleString(),
                            )}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
