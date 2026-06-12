"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { useLocale } from "@/core/i18n/locale-context";
import { useCustomersQuery } from "@/tailor/infrastructure/api/hooks/use-customers";
import { CustomerEditDialog } from "./customer-edit-dialog";
import { CustomerListItem } from "./customer-list-item";
import { CustomerListSkeleton } from "@/tailor/ui/skeletons";

export function CustomersView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

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
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900 md:text-2xl">
          {t.nav.customers}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t.customers.subtitle}</p>
      </div>

      <form
        onSubmit={handleSearch}
        className={cn(
          "mb-4 flex flex-col gap-3 sm:flex-row",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.customers.searchPlaceholder}
          className="flex-1"
        />
        <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
          <Button type="submit" className="gap-2 sm:min-w-32">
            <Search className="h-4 w-4" />
            {t.search.button}
          </Button>
          {submittedQuery && (
            <Button type="button" variant="outline" onClick={clearSearch}>
              {t.customers.showAll}
            </Button>
          )}
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
            <CustomerListItem
              key={customer.id}
              customer={customer}
              onSelect={setSelectedCustomerId}
            />
          ))}
        </section>
      )}

      <CustomerEditDialog
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </>
  );
}
