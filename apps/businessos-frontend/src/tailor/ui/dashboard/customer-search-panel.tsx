"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Shirt } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Badge } from "@/core/presentation/components/ui/badge";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useCustomerSearchQuery } from "@/tailor/infrastructure/api/hooks/use-customer-search";
import { CustomerSearchResultsSkeleton } from "@/tailor/ui/skeletons";

interface CustomerSearchPanelProps {
  compactTitle?: string;
}

export function CustomerSearchPanel({ compactTitle }: CustomerSearchPanelProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const [input, setInput] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data: results = [], isLoading, isFetching } = useCustomerSearchQuery(
    submittedQuery,
    submittedQuery.length >= 2,
  );

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setSubmittedQuery(input.trim());
  }

  return (
    <Card>
      <CardTitle>{compactTitle ?? t.search.title}</CardTitle>
      {!compactTitle ? (
        <p className="mt-1 text-sm text-muted-slate">{t.search.subtitle}</p>
      ) : null}

      <form onSubmit={handleSearch} className={cn("mt-4", isRtl && "text-right")}>
        <div
          className={cn(
            "flex h-11 items-stretch overflow-hidden rounded-xl border border-hairline bg-white shadow-sm transition-shadow focus-within:border-brand-700 focus-within:ring-2 focus-within:ring-brand-100",
            isRtl && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2.5 px-3",
              isRtl && "flex-row-reverse",
            )}
          >
            <Search
              className="h-4 w-4 shrink-0 text-muted-slate"
              aria-hidden
            />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.search.placeholder}
              aria-label={t.search.placeholder}
              className={cn(
                "min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-sm",
                isRtl && "text-right",
              )}
            />
          </div>
          <Button
            type="submit"
            variant="brand"
            aria-label={t.search.button}
            className="h-auto min-h-0 shrink-0 rounded-none px-4 sm:min-w-[6.75rem] sm:px-5"
          >
            <Search className="h-4 w-4 shrink-0 sm:hidden" aria-hidden />
            <span className="hidden sm:inline">{t.search.button}</span>
          </Button>
        </div>
      </form>

      {submittedQuery.length >= 2 && (
        <div className="mt-6 space-y-4">
          {(isLoading || isFetching) && (
            <CustomerSearchResultsSkeleton count={2} />
          )}

          {!isLoading && !isFetching && results.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              {t.search.noResults}
            </div>
          )}

          {results.map((result) => (
            <div
              key={result.customer.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
            >
              <div
                className={cn(
                  "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
                  isRtl && "sm:flex-row-reverse",
                )}
              >
                <div className={cn("flex gap-3", isRtl && "flex-row-reverse")}>
                  <UserAvatar name={result.customer.name} size="lg" />
                  <div className={cn(isRtl && "text-right")}>
                    <Link
                      href={routes.customerDetail(result.customer.id)}
                      className="text-lg font-bold text-slate-900 hover:text-brand-700 hover:underline"
                    >
                      {result.customer.name}
                    </Link>
                    <p className="text-sm text-slate-600">{result.customer.phone}</p>
                    {result.customer.email && (
                      <p className="text-sm text-slate-500">{result.customer.email}</p>
                    )}
                    <p className="mt-1 text-sm font-medium text-brand-800">
                      {t.search.totalOrders}: {result.totalOrders}
                    </p>
                  </div>
                </div>

                <Link href={routes.newOrderForCustomer(result.customer.id)}>
                  <Button className="w-full gap-2 sm:w-auto">
                    <Plus className="h-4 w-4" />
                    {t.search.placeOrderAgain}
                  </Button>
                </Link>
              </div>

              {result.garmentCounts.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.search.garmentsOrdered}
                  </p>
                  <div
                    className={cn(
                      "mt-2 flex flex-wrap gap-2",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    {result.garmentCounts.map((item) => (
                      <span
                        key={item.garmentType}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                      >
                        <Shirt className="h-3.5 w-3.5 text-brand-700" />
                        {item.garmentLabel} × {item.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.orders.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.search.orderHistory}
                  </p>
                  {result.orders.map((order) => (
                    <Link
                      key={order.id}
                      href={routes.orderDetail(order.id)}
                      className={cn(
                        "flex flex-col gap-2 rounded-xl border border-white bg-white px-4 py-3 transition hover:border-brand-200 sm:flex-row sm:items-center sm:justify-between",
                        isRtl && "sm:flex-row-reverse",
                      )}
                    >
                      <div className={cn(isRtl && "text-right")}>
                        <p className="font-semibold text-slate-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-slate-600">
                          {order.garmentLabel} · {order.deliveryDate}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-3",
                          isRtl && "flex-row-reverse",
                        )}
                      >
                        <Badge variant={order.status}>
                          {t.status[order.status]}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-700">
                          Rs. {order.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
