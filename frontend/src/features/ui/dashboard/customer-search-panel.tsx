"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Plus, Search, Shirt, X } from "lucide-react";
import { getDictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Badge } from "@/core/presentation/components/ui/badge";
import { UserAvatar } from "@/core/presentation/components/ui/user-avatar";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useDebouncedValue } from "@/core/presentation/hooks/use-debounced-value";
import { useCustomerSearchQuery } from "@/features/infrastructure/api/hooks/use-customer-search";
import { CustomerSearchResultsSkeleton } from "@/features/ui/skeletons";

const SEARCH_DEBOUNCE_MS = 300;

interface CustomerSearchPanelProps {
  compactTitle?: string;
  hideTitle?: boolean;
  variant?: "default" | "mobile";
  className?: string;
}

interface CustomerSearchMobileContextValue {
  compactTitle?: string;
  input: string;
  submittedQuery: string;
  results: NonNullable<ReturnType<typeof useCustomerSearchQuery>["data"]>;
  isLoading: boolean;
  isFetching: boolean;
  clearSearch: () => void;
  handleInputChange: (value: string) => void;
  handleSearch: (event: React.FormEvent) => void;
}

const CustomerSearchMobileContext =
  createContext<CustomerSearchMobileContextValue | null>(null);

function useCustomerSearchMobileContext() {
  const context = useContext(CustomerSearchMobileContext);
  if (!context) {
    throw new Error(
      "CustomerSearchMobileHeader/Results must be used within CustomerSearchMobileShell",
    );
  }
  return context;
}

function useCustomerSearchState() {
  const [input, setInput] = useState("");
  const debouncedInput = useDebouncedValue(input.trim(), SEARCH_DEBOUNCE_MS);
  const submittedQuery = debouncedInput.length >= 2 ? debouncedInput : "";

  const { data: results = [], isLoading, isFetching } = useCustomerSearchQuery(
    submittedQuery,
    submittedQuery.length >= 2,
  );

  function clearSearch() {
    setInput("");
  }

  function handleInputChange(value: string) {
    setInput(value);
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
  }

  return {
    input,
    submittedQuery,
    results,
    isLoading,
    isFetching,
    clearSearch,
    handleInputChange,
    handleSearch,
  };
}

function CustomerSearchField({
  input,
  placeholder,
  clearLabel,
  isRtl,
  onInputChange,
  onSubmit,
  onClear,
}: {
  input: string;
  placeholder: string;
  clearLabel: string;
  isRtl?: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClear: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className={cn(isRtl && "text-right")}>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-[11px] border border-hairline bg-background px-3 py-2.5 transition-colors focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100",
          isRtl && "flex-row-reverse",
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-slate" aria-hidden />
        <input
          type="search"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent text-[12.5px] text-foreground outline-none placeholder:text-muted-slate [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
            isRtl && "text-right",
          )}
        />
        {input ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={clearLabel}
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-slate transition-colors hover:bg-slate-100 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function CustomerSearchMobileShell({
  compactTitle,
  children,
}: {
  compactTitle?: string;
  children: ReactNode;
}) {
  const search = useCustomerSearchState();

  return (
    <CustomerSearchMobileContext.Provider
      value={{ compactTitle, ...search }}
    >
      {children}
    </CustomerSearchMobileContext.Provider>
  );
}

export function CustomerSearchMobileHeader({
  className,
}: {
  className?: string;
}) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { compactTitle, input, clearSearch, handleInputChange, handleSearch } =
    useCustomerSearchMobileContext();

  return (
    <div className={className}>
      {compactTitle ? (
        <h2
          className={cn(
            "mb-3 font-display text-sm font-bold text-foreground",
            isRtl && "text-right",
          )}
        >
          {compactTitle}
        </h2>
      ) : null}
      <CustomerSearchField
        input={input}
        placeholder={t.search.placeholderCompact}
        clearLabel={t.search.clear}
        isRtl={isRtl}
        onInputChange={handleInputChange}
        onSubmit={handleSearch}
        onClear={clearSearch}
      />
    </div>
  );
}

export function CustomerSearchMobileResults({
  className,
}: {
  className?: string;
}) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const {
    submittedQuery,
    results,
    isLoading,
    isFetching,
  } = useCustomerSearchMobileContext();

  if (submittedQuery.length < 2) {
    return null;
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      {(isLoading || isFetching) && (
        <CustomerSearchResultsSkeleton count={2} />
      )}

      {!isLoading && !isFetching && results.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {t.search.noResults}
        </div>
      )}

      {!isLoading && !isFetching && results.length > 1 && (
        <p className={cn("text-xs text-slate-500", isRtl && "text-right")}>
          {t.search.multipleMatches.replace("{count}", String(results.length))}
        </p>
      )}

      {results.map((result) => (
        <CustomerSearchResultCard
          key={result.customer.id}
          result={result}
          t={t}
          isRtl={isRtl}
          variant="mobile"
        />
      ))}
    </div>
  );
}

function CustomerSearchResultCard({
  result,
  t,
  isRtl,
  variant = "default",
}: {
  result: NonNullable<ReturnType<typeof useCustomerSearchQuery>["data"]>[number];
  t: ReturnType<typeof getDictionary>;
  isRtl: boolean;
  variant?: "default" | "compact" | "mobile";
}) {
  const isCompact = variant === "compact" || variant === "mobile";
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-slate-50/80",
        isMobile ? "rounded-xl p-2.5" : isCompact ? "p-3" : "p-4 sm:p-5",
      )}
    >
      <div className={cn("flex gap-2.5", isRtl && "flex-row-reverse", !isMobile && "gap-3")}>
        <UserAvatar
          name={result.customer.name}
          size={isMobile ? "sm" : isCompact ? "md" : "lg"}
        />
        <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
          <Link
            href={routes.customerDetail(result.customer.id)}
            className={cn(
              "font-bold text-slate-900 hover:text-brand-700 hover:underline",
              isMobile ? "text-sm leading-snug" : isCompact ? "text-sm leading-snug" : "text-lg",
            )}
          >
            {result.customer.name}
          </Link>
          <p className={cn("text-slate-600", isMobile || isCompact ? "text-xs" : "text-sm")}>
            {result.customer.phone}
          </p>
          {result.customer.email && !isMobile ? (
            <p
              className={cn(
                "text-slate-500",
                isCompact ? "truncate text-xs" : "text-sm",
              )}
            >
              {result.customer.email}
            </p>
          ) : null}
          <p
            className={cn(
              "font-medium text-brand-800",
              isMobile || isCompact ? "mt-0.5 text-xs" : "mt-1 text-sm",
            )}
          >
            {t.search.totalOrders}: {result.totalOrders}
          </p>
        </div>
      </div>

      <Link
        href={routes.newOrderForCustomer(result.customer.id)}
        className={cn("block", isMobile ? "mt-2" : isCompact ? "mt-3" : "mt-4")}
      >
        <Button
          className={cn(
            "w-full gap-2",
            isMobile ? "h-8 text-xs" : isCompact ? "h-9 text-xs" : "h-11",
          )}
        >
          <Plus className={cn(isMobile ? "h-3 w-3" : isCompact ? "h-3.5 w-3.5" : "h-4 w-4")} />
          {t.search.placeOrderAgain}
        </Button>
      </Link>

      {result.garmentCounts.length > 0 ? (
        <div className={isMobile ? "mt-2" : isCompact ? "mt-3" : "mt-4"}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {t.search.garmentsOrdered}
          </p>
          <div
            className={cn(
              "mt-1 flex flex-wrap gap-1",
              isRtl && "flex-row-reverse",
              !isMobile && "mt-1.5 gap-1.5",
            )}
          >
            {result.garmentCounts.map((item) => (
              <span
                key={item.garmentType}
                className={cn(
                  "inline-flex max-w-full items-center gap-1 rounded-full border border-slate-200 bg-white font-medium text-slate-700",
                  isMobile
                    ? "px-1.5 py-0.5 text-[10px]"
                    : isCompact
                      ? "px-2 py-0.5 text-[11px]"
                      : "gap-1.5 px-3 py-1.5 text-sm",
                )}
              >
                <Shirt
                  className={cn(
                    "shrink-0 text-brand-700",
                    isMobile ? "h-2.5 w-2.5" : isCompact ? "h-3 w-3" : "h-3.5 w-3.5",
                  )}
                />
                <span className="truncate">
                  {item.garmentLabel} × {item.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {result.orders.length > 0 ? (
        <div
          className={cn(
            isMobile ? "mt-2 space-y-1" : isCompact ? "mt-3 space-y-1.5" : "mt-4 space-y-2",
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {t.search.orderHistory}
          </p>
          {(isMobile ? result.orders.slice(0, 2) : result.orders).map((order) =>
            isCompact ? (
              <Link
                key={order.id}
                href={routes.orderDetail(order.id)}
                className="block space-y-1 rounded-lg border border-white bg-white px-2.5 py-2 transition hover:border-brand-200"
              >
                <div
                  className={cn(
                    "flex items-center justify-between gap-2",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <p
                    className={cn(
                      "min-w-0 truncate text-xs font-semibold text-slate-900",
                      isRtl && "text-right",
                    )}
                  >
                    #{order.orderNumber}
                  </p>
                  <Badge
                    variant={order.status}
                    className="shrink-0 px-1.5 py-0 text-[9px] leading-4"
                  >
                    {t.status[order.status]}
                  </Badge>
                </div>
                <p
                  className={cn(
                    "truncate text-[11px] text-slate-600",
                    isRtl && "text-right",
                  )}
                >
                  {order.garmentLabel}
                </p>
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 text-[11px]",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <span className="text-slate-500">{order.deliveryDate}</span>
                  <span className="shrink-0 font-semibold text-slate-700">
                    Rs. {order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                key={order.id}
                href={routes.orderDetail(order.id)}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border border-white bg-white px-4 py-3 transition hover:border-brand-200 sm:flex-row sm:items-center sm:justify-between",
                  isRtl && "sm:flex-row-reverse",
                )}
              >
                <div className={cn("min-w-0", isRtl && "text-right")}>
                  <p className="font-semibold text-slate-900">
                    #{order.orderNumber}
                  </p>
                  <p className="text-sm text-slate-600">
                    {order.garmentLabel} · {order.deliveryDate}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <Badge variant={order.status}>{t.status[order.status]}</Badge>
                  <span className="shrink-0 text-sm font-semibold text-slate-700">
                    Rs. {order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </Link>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

export function CustomerSearchPanel({
  compactTitle,
  hideTitle = false,
  variant = "default",
  className,
}: CustomerSearchPanelProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const isCompactSidebar = variant !== "mobile";
  const {
    input,
    submittedQuery,
    results,
    isLoading,
    isFetching,
    clearSearch,
    handleInputChange,
    handleSearch,
  } = useCustomerSearchState();

  const title = compactTitle ?? t.search.title;

  const resultsSection =
    submittedQuery.length >= 2 ? (
      <div className={cn(variant === "mobile" ? "space-y-4" : "mt-4 space-y-4")}>
        {(isLoading || isFetching) && (
          <CustomerSearchResultsSkeleton count={2} />
        )}

        {!isLoading && !isFetching && results.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            {t.search.noResults}
          </div>
        )}

        {!isLoading && !isFetching && results.length > 1 && (
          <p className={cn("text-xs text-slate-500", isRtl && "text-right")}>
            {t.search.multipleMatches.replace("{count}", String(results.length))}
          </p>
        )}

        {results.map((result) => (
          <CustomerSearchResultCard
            key={result.customer.id}
            result={result}
            t={t}
            isRtl={isRtl}
            variant={isCompactSidebar ? "compact" : "default"}
          />
        ))}
      </div>
    ) : null;

  if (variant === "mobile") {
    return (
      <div className={className}>
        {!hideTitle ? (
          <h2
            className={cn(
              "mb-3 font-display text-sm font-bold text-foreground",
              isRtl && "text-right",
            )}
          >
            {title}
          </h2>
        ) : null}
        <CustomerSearchField
          input={input}
          placeholder={t.search.placeholderCompact}
          clearLabel={t.search.clear}
          isRtl={isRtl}
          onInputChange={handleInputChange}
          onSubmit={handleSearch}
          onClear={clearSearch}
        />
        {resultsSection ? <div className="mt-4">{resultsSection}</div> : null}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-hairline bg-card px-4 py-[18px] shadow-sm sm:px-5",
        className,
      )}
    >
      {!hideTitle ? (
        <h2
          className={cn(
            "mb-3 font-display text-sm font-bold text-foreground",
            isRtl && "text-right",
          )}
        >
          {title}
        </h2>
      ) : null}

      <CustomerSearchField
        input={input}
        placeholder={t.search.placeholderCompact}
        clearLabel={t.search.clear}
        isRtl={isRtl}
        onInputChange={handleInputChange}
        onSubmit={handleSearch}
        onClear={clearSearch}
      />
      {resultsSection}
    </section>
  );
}
