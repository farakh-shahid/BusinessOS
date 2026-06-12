"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { useReceivablesQuery } from "@/tailor/infrastructure/api/hooks/use-orders";

export function ReceivablesView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: orders = [], isLoading, isError } = useReceivablesQuery();

  const total = orders.reduce((sum, o) => sum + o.balanceDue, 0);

  return (
    <>
      <div className="mb-4">
        <Link
          href={routes.dashboard}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          ← {t.nav.dashboard}
        </Link>
        <h2 className="mt-2 text-lg font-bold text-slate-900 md:text-2xl">
          {t.receivables.title}
        </h2>
        <p className="text-sm text-slate-500">{t.receivables.subtitle}</p>
      </div>

      <div className="mb-4 rounded-2xl bg-gradient-to-r from-sidebar to-sidebar-dark p-5 text-white">
        <p className="text-sm text-sidebar-text/90">{t.receivables.totalOutstanding}</p>
        <p className="text-2xl font-bold">Rs. {total.toLocaleString()}</p>
        <p className="mt-1 text-sm text-sidebar-text/80">
          {orders.length} {t.receivables.ordersWithBalance}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          {t.common.loading}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {t.receivables.empty}
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={routes.orderDetail(order.id)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md",
                  isRtl && "flex-row-reverse",
                )}
              >
                <div className={cn(isRtl && "text-right")}>
                  <p className="font-semibold text-slate-900">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-slate-400">#{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.garmentLabel} · {order.dueDate}
                  </p>
                </div>
                <div className={cn("text-right", isRtl && "text-left")}>
                  <p className="text-lg font-bold text-rose-700">
                    Rs. {order.balanceDue.toLocaleString()}
                  </p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-500">
                    <Phone className="h-3 w-3" />
                    {order.customerPhone}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
