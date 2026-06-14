"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
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
  type OrderListView,
} from "@/tailor/infrastructure/data/order-list-params";
import { computeOrderListSummary } from "@/tailor/infrastructure/data/order-list-ui";
import { OrderQuickFilters } from "@/tailor/ui/orders/order-quick-filters";
import { OrderFiltersSheet } from "@/tailor/ui/orders/order-filters-sheet";
import { OrderList } from "@/tailor/ui/orders/order-list";
import { OrderBoardView } from "@/tailor/ui/orders/order-board-view";
import { OrderTableView } from "@/tailor/ui/orders/order-table-view";
import { OrderViewSwitcher } from "@/tailor/ui/orders/order-view-switcher";
import { OrderListSkeleton } from "@/tailor/ui/skeletons";
import { BackLink } from "@/tailor/ui/shared/back-link";
import { PageHeader } from "@/tailor/ui/shared/page-header";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";

export function OrdersView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const hydrated = useRef(false);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    patchParams({ search: searchInput.trim() });
  }

  function handleViewChange(view: OrderListView) {
    patchParams({ view });
  }

  const summary = computeOrderListSummary(orders);
  const summaryText = t.orderList.summaryMeta
    .replace("{active}", String(summary.active))
    .replace("{rush}", String(summary.rush))
    .replace("{dueToday}", String(summary.dueToday));

  return (
    <>
      <BackLink href={routes.dashboard} label={t.nav.dashboard} isRtl={isRtl} />

      <PageHeader
        title={t.orders.allOrders}
        subtitle={!isLoading && !isError ? summaryText : undefined}
        isRtl={isRtl}
        actions={
          <Link
            href={routes.newOrder}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" />
            {t.nav.newOrder}
          </Link>
        }
        meta={
          params.assignedTo ? (
            <p className="inline-flex max-w-full min-w-0 items-baseline gap-1 text-sm text-muted-slate">
              <span className="shrink-0">{t.form.assignedTo}:</span>
              <PersonNameText
                name={params.assignedTo}
                className="min-w-0 font-medium text-foreground"
              />
            </p>
          ) : undefined
        }
      />

      <div
        className={cn(
          "sticky top-0 z-20 -mx-4 space-y-3 border-b border-hairline bg-background/95 px-4 py-3 backdrop-blur-md",
          "sm:-mx-6 sm:px-6",
          "lg:-mx-10 lg:px-10",
        )}
      >
        <form
          onSubmit={handleSearchSubmit}
          className={cn("flex gap-2", isRtl && "flex-row-reverse")}
        >
          <div className="relative min-w-0 flex-1">
            <Search
              className={cn(
                "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-slate",
                isRtl ? "right-3" : "left-3",
              )}
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.orderList.searchOrdersPlaceholder}
              className={cn("w-full bg-card", isRtl ? "pr-10" : "pl-10")}
            />
          </div>
          <Button type="submit" variant="brand" className="shrink-0 gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">{t.search.button}</span>
          </Button>
        </form>

        <OrderQuickFilters
          params={params}
          t={t}
          isRtl={isRtl}
          onFilterChange={handleFilterChange}
          onOpenSheet={() => setSheetOpen(true)}
          trailing={
            <OrderViewSwitcher
              view={params.view}
              t={t}
              isRtl={isRtl}
              onChange={handleViewChange}
            />
          }
        />
      </div>

      <OrderFiltersSheet
        open={sheetOpen}
        params={params}
        t={t}
        isRtl={isRtl}
        onClose={() => setSheetOpen(false)}
        onApply={applyParams}
      />

      <div className="mt-4">
        {isLoading ? (
          <OrderListSkeleton count={5} />
        ) : isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
            {t.common.error}
          </div>
        ) : params.view === "board" ? (
          <OrderBoardView orders={orders} t={t} isRtl={isRtl} />
        ) : params.view === "table" ? (
          <OrderTableView orders={orders} t={t} isRtl={isRtl} />
        ) : (
          <OrderList orders={orders} showViewAll={false} />
        )}
      </div>
    </>
  );
}
