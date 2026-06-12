"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Input } from "@/core/presentation/components/ui/input";
import { useLocale } from "@/core/i18n/locale-context";
import { useOrdersQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
import type { OrderListFilter } from "@/tailor/infrastructure/data/order-filters";
import {
  buildOrdersListUrl,
  hasUrlListParams,
  loadPersistedOrderListParams,
  parseOrderListParams,
  persistOrderListParams,
  type OrderListParams,
  type OrderListSort,
} from "@/tailor/infrastructure/data/order-list-params";
import { OrderFilterChips } from "@/tailor/ui/orders/order-filter-chips";
import { OrderListControls } from "@/tailor/ui/orders/order-list-controls";
import { OrderList } from "@/tailor/ui/orders/order-list";

export function OrdersView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const hydrated = useRef(false);

  const [params, setParams] = useState<OrderListParams>(() =>
    parseOrderListParams(searchParams),
  );
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search")?.trim() ?? "",
  );

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    if (!hasUrlListParams(searchParams)) {
      const saved = loadPersistedOrderListParams();
      if (saved) {
        router.replace(buildOrdersListUrl(saved), { scroll: false });
      }
    }
  }, [router, searchParams]);

  useEffect(() => {
    const next = parseOrderListParams(searchParams);
    setParams(next);
    setSearchInput(next.search);
  }, [searchParams]);

  const { data: orders = [], isLoading, isError } = useOrdersQuery({
    filter: params.filter || undefined,
    search: params.search || undefined,
    assignedTo: params.assignedTo || undefined,
    sort: params.sort,
    dueFrom: params.dueFrom || undefined,
    dueTo: params.dueTo || undefined,
  });

  function applyParams(next: OrderListParams) {
    persistOrderListParams(next);
    router.replace(buildOrdersListUrl(next), { scroll: false });
  }

  function patchParams(patch: Partial<OrderListParams>) {
    applyParams({ ...params, ...patch });
  }

  function handleFilterChange(next: OrderListFilter) {
    patchParams({
      filter: next,
      dueFrom: next === "due_this_week" ? "" : params.dueFrom,
      dueTo: next === "due_this_week" ? "" : params.dueTo,
    });
  }

  function handleSortChange(sort: OrderListSort) {
    patchParams({ sort });
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    patchParams({ search: searchInput.trim() });
  }

  function handleDueFromChange(dueFrom: string) {
    patchParams({
      filter: params.filter === "due_this_week" ? "" : params.filter,
      dueFrom,
    });
  }

  function handleDueToChange(dueTo: string) {
    patchParams({
      filter: params.filter === "due_this_week" ? "" : params.filter,
      dueTo,
    });
  }

  function handleClearDateRange() {
    patchParams({ dueFrom: "", dueTo: "" });
  }

  return (
    <>
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <Link
            href={routes.dashboard}
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            ← {t.nav.dashboard}
          </Link>
          <h2 className="mt-2 text-lg font-bold text-slate-900 md:text-2xl">
            {t.orders.allOrders}
          </h2>
          {params.assignedTo ? (
            <p className="mt-1 text-sm text-slate-500">
              {t.form.assignedTo}:{" "}
              <span className="font-medium text-slate-700">
                {params.assignedTo}
              </span>
            </p>
          ) : null}
        </div>
        <Link
          href={routes.newOrder}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t.nav.newOrder}</span>
        </Link>
      </div>

      <div className="mb-4 space-y-3">
        <form
          onSubmit={handleSearchSubmit}
          className={cn("flex gap-2", isRtl && "flex-row-reverse")}
        >
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t.orderFilters.searchPlaceholder}
            className="flex-1"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Search className="h-4 w-4" />
            {t.search.button}
          </button>
        </form>

        <OrderFilterChips value={params.filter} onChange={handleFilterChange} />

        <OrderListControls
          t={t}
          sort={params.sort}
          dueFrom={params.dueFrom}
          dueTo={params.dueTo}
          isRtl={isRtl}
          onSortChange={handleSortChange}
          onDueFromChange={handleDueFromChange}
          onDueToChange={handleDueToChange}
          onClearDateRange={handleClearDateRange}
        />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          {t.common.loading}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : (
        <OrderList orders={orders} showViewAll={false} />
      )}
    </>
  );
}
