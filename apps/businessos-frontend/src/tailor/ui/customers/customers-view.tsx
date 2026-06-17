"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { useDebouncedValue } from "@/core/presentation/hooks/use-debounced-value";
import { useLocale } from "@/core/i18n/locale-context";
import {
  useCustomerFilterCountsQuery,
  useInfiniteCustomersQuery,
} from "@/tailor/infrastructure/api/hooks/use-customers";
import type { CustomerListSegment } from "@/tailor/infrastructure/data/customer-list-filters";
import {
  emptyRegistrationFilter,
  registrationFilterIsActive,
  resolveRegisteredDateRange,
  type CustomerRegistrationFilter,
} from "@/tailor/infrastructure/data/customer-list-filters";
import { CustomerListItem } from "./customer-list-item";
import { CustomerFiltersSheet } from "./customer-filters-sheet";
import { CustomerQuickFilters } from "./customer-quick-filters";
import { CustomerListSkeleton } from "@/tailor/ui/skeletons";
import { PageHeader } from "@/tailor/ui/shared/page-header";

const SEARCH_DEBOUNCE_MS = 350;

export function CustomersView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [segment, setSegment] = useState<CustomerListSegment>("");
  const [registration, setRegistration] = useState<CustomerRegistrationFilter>(
    emptyRegistrationFilter,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debouncedInput = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setSearchQuery(debouncedInput.trim());
  }, [debouncedInput]);

  const dateRange = useMemo(
    () => resolveRegisteredDateRange(registration),
    [registration],
  );

  const listParams = useMemo(
    () => ({
      q: searchQuery || undefined,
      segment: segment || undefined,
      registeredFrom: dateRange.registeredFrom,
      registeredTo: dateRange.registeredTo,
    }),
    [searchQuery, segment, dateRange],
  );

  const filterCountParams = useMemo(
    () => ({
      q: searchQuery || undefined,
      registeredFrom: dateRange.registeredFrom,
      registeredTo: dateRange.registeredTo,
    }),
    [searchQuery, dateRange],
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCustomersQuery(listParams);

  const { data: filterCounts } = useCustomerFilterCountsQuery(filterCountParams);

  const customers = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, customers.length]);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setSearchQuery("");
  }

  const hasActiveSearch = searchQuery.length > 0;
  const hasActiveFilters =
    hasActiveSearch || segment !== "" || registrationFilterIsActive(registration);

  return (
    <>
      <PageHeader
        title={t.nav.customers}
        subtitle={t.customers.subtitle}
        isRtl={isRtl}
      />

      <div className="mb-5 space-y-3">
        <form onSubmit={handleSearchSubmit} className={isRtl ? "text-right" : undefined}>
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border border-hairline bg-card p-1.5 shadow-sm",
              isRtl && "flex-row-reverse",
            )}
          >
            <div className="relative min-w-0 flex-1">
              <Search
                className={cn(
                  "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400",
                  isRtl ? "right-3" : "left-3",
                )}
              />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.customers.searchPlaceholder}
                className={cn(
                  "border-0 bg-transparent shadow-none focus-visible:ring-0",
                  isRtl ? "pr-10 pl-3" : "pl-10 pr-3",
                )}
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              className="h-9 shrink-0 gap-1.5 px-3.5 text-sm"
            >
              <Search className="h-4 w-4" />
              {t.search.button}
            </Button>
          </div>
        </form>

        {hasActiveSearch ? (
          <div className={cn("flex", isRtl && "justify-end")}>
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              {t.customers.showAll}
            </button>
          </div>
        ) : null}

        <CustomerQuickFilters
          segment={segment}
          registration={registration}
          t={t}
          isRtl={isRtl}
          filterCounts={filterCounts}
          onSegmentChange={setSegment}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      </div>

      <CustomerFiltersSheet
        open={filtersOpen}
        registration={registration}
        t={t}
        isRtl={isRtl}
        onClose={() => setFiltersOpen(false)}
        onApply={setRegistration}
      />

      {isLoading ? (
        <CustomerListSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {hasActiveFilters ? t.search.noResults : t.customers.empty}
        </div>
      ) : (
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.customers.customerCount.replace(
              "{count}",
              String(customers.length),
            )}
            {hasNextPage ? ` · ${t.customerFilters.loadingMoreHint}` : null}
          </p>
          {customers.map((customer) => (
            <CustomerListItem key={customer.id} customer={customer} />
          ))}
          <div
            ref={loadMoreRef}
            className="py-4 text-center text-sm text-muted-slate"
          >
            {isFetchingNextPage
              ? t.orderList.loadMore
              : hasNextPage
                ? null
                : t.orderList.endOfList}
          </div>
        </section>
      )}
    </>
  );
}
