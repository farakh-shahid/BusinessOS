"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { useLocale } from "@/core/i18n/locale-context";
import { useCustomersQuery } from "@/tailor/infrastructure/api/hooks/use-customers";
import { CustomerListItem } from "./customer-list-item";
import { CustomerListSkeleton } from "@/tailor/ui/skeletons";
import { PageHeader } from "@/tailor/ui/shared/page-header";

export function CustomersView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data: customers = [], isLoading, isError } = useCustomersQuery();

  const filteredCustomers = useMemo(() => {
    const q = submittedQuery.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(q) ||
        customer.phone.includes(q) ||
        customer.email?.toLowerCase().includes(q),
    );
  }, [customers, submittedQuery]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  function clearSearch() {
    setQuery("");
    setSubmittedQuery("");
  }

  return (
    <>
      <PageHeader
        title={t.nav.customers}
        subtitle={t.customers.subtitle}
        isRtl={isRtl}
      />

      <form
        onSubmit={handleSearch}
        className={cn("mb-5 space-y-3", isRtl && "text-right")}
      >
        <div className="relative">
          <Search
            className={cn(
              "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400",
              isRtl ? "right-3" : "left-3",
            )}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.customers.searchPlaceholder}
            className={cn("w-full", isRtl ? "pr-10" : "pl-10")}
          />
        </div>
        <div
          className={cn(
            "flex flex-col gap-2 sm:flex-row",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <Button type="submit" variant="brand" className="h-11 w-full gap-2 sm:min-w-32 sm:w-auto">
            <Search className="h-4 w-4 shrink-0" />
            {t.search.button}
          </Button>
          {submittedQuery ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              onClick={clearSearch}
            >
              {t.customers.showAll}
            </Button>
          ) : null}
        </div>
      </form>

      {isLoading ? (
        <CustomerListSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {submittedQuery ? t.search.noResults : t.customers.empty}
        </div>
      ) : (
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.customers.customerCount.replace(
              "{count}",
              String(filteredCustomers.length),
            )}
          </p>
          {filteredCustomers.map((customer) => (
            <CustomerListItem key={customer.id} customer={customer} />
          ))}
        </section>
      )}
    </>
  );
}
