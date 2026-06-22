"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getDictionary } from "@/i18n";
import type { ReceivedCustomerRow, ReceivableCustomerRow } from "@shared";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import {
  useMarkReceivableCustomerPaidMutation,
  useReceivablesQuery,
  useSendReminderMutation,
} from "@/features/infrastructure/api/hooks/use-orders";
import {
  ReceivablesListSkeleton,
  ReceivablesSummarySkeleton,
} from "@/features/ui/skeletons";
import { BackLink } from "@/features/ui/shared/back-link";
import { PageHeader } from "@/features/ui/shared/page-header";
import {
  ReceivablesTabSwitcher,
  type ReceivablesTab,
} from "@/features/ui/receivables/receivables-tab-switcher";

function formatRs(amount: number): string {
  return `Rs ${amount.toLocaleString()}`;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  valueClassName,
  iconClassName,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  valueClassName?: string;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-[15px] border border-hairline bg-card px-4 py-4 shadow-sm">
      <div
        className={cn(
          "mb-3 flex h-9 w-9 items-center justify-center rounded-[10px]",
          iconClassName ?? "bg-accent-50 text-accent-500",
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
      <p
        className={cn(
          "font-display text-[1.6875rem] font-bold leading-none tracking-tight",
          valueClassName ?? "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-muted-slate sm:text-sm">{label}</p>
    </div>
  );
}

function ReceivableCustomerTableRow({
  row,
  t,
  isRtl,
  onMarkPaid,
  onRemind,
  markingPaid,
  reminding,
}: {
  row: ReceivableCustomerRow;
  t: ReturnType<typeof getDictionary>;
  isRtl: boolean;
  onMarkPaid: (customerId: string) => void;
  onRemind: (orderId: string) => void;
  markingPaid: boolean;
  reminding: boolean;
}) {
  return (
    <tr className="border-b border-hairline last:border-b-0">
      <td className={cn("px-4 py-3.5", isRtl && "text-right")}>
        <Link
          href={routes.customerDetail(row.customerId)}
          className="font-semibold text-foreground hover:text-brand-700 hover:underline"
        >
          {row.customerName}
        </Link>
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-sm text-muted-slate",
          isRtl && "text-right",
        )}
        dir="ltr"
      >
        {row.customerPhone}
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-sm font-medium text-foreground",
          isRtl && "text-right",
        )}
      >
        {row.orderCount}
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-right text-sm font-bold text-status-urgent",
          isRtl && "text-left",
        )}
      >
        {formatRs(row.totalBalance)}
      </td>
      <td className="px-4 py-3.5">
        <div
          className={cn(
            "flex flex-wrap items-center justify-end gap-2",
            isRtl && "flex-row-reverse justify-start",
          )}
        >
          <button
            type="button"
            disabled={markingPaid}
            onClick={() => onMarkPaid(row.customerId)}
            className="inline-flex min-h-9 items-center rounded-xl bg-status-ready px-3.5 text-xs font-semibold text-white transition hover:bg-[#0f8f5c] disabled:opacity-60"
          >
            {t.receivables.markPaid}
          </button>
          <button
            type="button"
            disabled={reminding}
            onClick={() => onRemind(row.primaryOrderId)}
            className="inline-flex min-h-9 items-center rounded-xl border border-hairline bg-white px-3.5 text-xs font-semibold text-foreground transition hover:bg-slate-50 disabled:opacity-60"
          >
            {t.receivables.remind}
          </button>
        </div>
      </td>
    </tr>
  );
}

function ReceivedCustomerTableRow({
  row,
  t,
  isRtl,
}: {
  row: ReceivedCustomerRow;
  t: ReturnType<typeof getDictionary>;
  isRtl: boolean;
}) {
  return (
    <tr className="border-b border-hairline last:border-b-0">
      <td className={cn("px-4 py-3.5", isRtl && "text-right")}>
        <Link
          href={routes.customerDetail(row.customerId)}
          className="font-semibold text-foreground hover:text-brand-700 hover:underline"
        >
          {row.customerName}
        </Link>
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-sm text-muted-slate",
          isRtl && "text-right",
        )}
        dir="ltr"
      >
        {row.customerPhone}
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-sm font-medium text-foreground",
          isRtl && "text-right",
        )}
      >
        {row.orderCount}
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-right text-sm font-bold text-status-ready",
          isRtl && "text-left",
        )}
      >
        {formatRs(row.totalReceived)}
      </td>
      <td className="px-4 py-3.5">
        <div
          className={cn(
            "flex justify-end",
            isRtl && "justify-start",
          )}
        >
          <Link
            href={routes.orderDetail(row.primaryOrderId)}
            className="inline-flex min-h-9 items-center rounded-xl border border-hairline bg-white px-3.5 text-xs font-semibold text-foreground transition hover:bg-slate-50"
          >
            {t.receivables.viewOrder}
          </Link>
        </div>
      </td>
    </tr>
  );
}

function CustomerTableShell({
  title,
  emptyMessage,
  isRtl,
  children,
}: {
  title: string;
  emptyMessage: string;
  isRtl: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[15px] border border-hairline bg-card shadow-sm">
      <div
        className={cn(
          "border-b border-hairline px-4 py-3.5 sm:px-5",
          isRtl && "text-right",
        )}
      >
        <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
      </div>
      {children ?? (
        <div className="px-4 py-10 text-center text-sm text-muted-slate sm:px-5">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export function ReceivablesView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { showError, showSuccess, showToast } = useToast();
  const { data, isLoading, isError } = useReceivablesQuery();
  const markPaid = useMarkReceivableCustomerPaidMutation();
  const sendReminder = useSendReminderMutation();
  const [tab, setTab] = useState<ReceivablesTab>("outstanding");
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  async function handleMarkPaid(customerId: string) {
    setActiveCustomerId(customerId);
    try {
      await markPaid.mutateAsync(customerId);
      showSuccess(t.receivables.markPaidSuccess);
    } catch {
      showError(t.common.error);
    } finally {
      setActiveCustomerId(null);
    }
  }

  async function handleRemind(orderId: string) {
    setActiveOrderId(orderId);
    try {
      const result = await sendReminder.mutateAsync(orderId);
      if (!result.sent && result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
        showToast(t.receipt.whatsappOpened, "info");
        return;
      }
      showSuccess(
        result.sent ? t.receivables.reminderSent : t.receipt.whatsappOpened,
      );
    } catch {
      showError(t.common.error);
    } finally {
      setActiveOrderId(null);
    }
  }

  const receivables = data?.receivables;
  const received = data?.received;

  return (
    <>
      <BackLink href={routes.dashboard} label={t.nav.dashboard} isRtl={isRtl} />

      <PageHeader
        title={t.receivables.title}
        subtitle={t.receivables.subtitle}
        isRtl={isRtl}
        className="mb-0"
      />

      {!isLoading && !isError ? (
        <ReceivablesTabSwitcher
          tab={tab}
          t={t}
          isRtl={isRtl}
          onChange={setTab}
          className="mb-4"
        />
      ) : null}

      {isLoading ? (
        <>
          <ReceivablesSummarySkeleton />
          <ReceivablesListSkeleton />
        </>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : tab === "outstanding" ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <SummaryCard
              label={t.receivables.totalOutstanding}
              value={formatRs(receivables?.summary.totalOutstanding ?? 0)}
              icon={Banknote}
              valueClassName="text-status-urgent"
              iconClassName="bg-rose-50 text-status-urgent"
            />
            <SummaryCard
              label={t.receivables.customersOwing}
              value={String(receivables?.summary.customersOwing ?? 0)}
              icon={Users}
              iconClassName="bg-brand-50 text-brand-700"
            />
            <SummaryCard
              label={t.receivables.collectedThisMonth}
              value={formatRs(receivables?.summary.collectedThisMonth ?? 0)}
              icon={CalendarDays}
              iconClassName="bg-slate-100 text-slate-600"
            />
          </div>

          <CustomerTableShell
            title={t.receivables.whoOwesYou}
            emptyMessage={t.receivables.empty}
            isRtl={isRtl}
          >
            {(receivables?.customers.length ?? 0) === 0 ? null : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-hairline bg-slate-50/80">
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-right",
                        )}
                      >
                        {t.receivables.columnCustomer}
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-right",
                        )}
                      >
                        {t.receivables.columnPhone}
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-right",
                        )}
                      >
                        {t.receivables.columnOrders}
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-left",
                        )}
                      >
                        {t.receivables.columnBalance}
                      </th>
                      <th scope="col" className="px-4 py-2.5" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {receivables?.customers.map((row) => (
                      <ReceivableCustomerTableRow
                        key={row.customerId}
                        row={row}
                        t={t}
                        isRtl={isRtl}
                        onMarkPaid={handleMarkPaid}
                        onRemind={handleRemind}
                        markingPaid={
                          markPaid.isPending && activeCustomerId === row.customerId
                        }
                        reminding={
                          sendReminder.isPending && activeOrderId === row.primaryOrderId
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CustomerTableShell>
        </>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <SummaryCard
              label={t.receivables.totalReceivedThisMonth}
              value={formatRs(received?.summary.totalReceivedThisMonth ?? 0)}
              icon={CheckCircle2}
              valueClassName="text-status-ready"
              iconClassName="bg-emerald-50 text-status-ready"
            />
            <SummaryCard
              label={t.receivables.customersPaid}
              value={String(received?.summary.customersPaid ?? 0)}
              icon={Users}
              iconClassName="bg-brand-50 text-brand-700"
            />
            <SummaryCard
              label={t.receivables.ordersPaid}
              value={String(received?.summary.ordersPaid ?? 0)}
              icon={ShoppingBag}
              iconClassName="bg-slate-100 text-slate-600"
            />
          </div>

          <CustomerTableShell
            title={t.receivables.whoPaidYou}
            emptyMessage={t.receivables.emptyReceived}
            isRtl={isRtl}
          >
            {(received?.customers.length ?? 0) === 0 ? null : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-hairline bg-slate-50/80">
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-right",
                        )}
                      >
                        {t.receivables.columnCustomer}
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-right",
                        )}
                      >
                        {t.receivables.columnPhone}
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-right",
                        )}
                      >
                        {t.receivables.columnOrders}
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          "px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                          isRtl && "text-left",
                        )}
                      >
                        {t.receivables.columnReceived}
                      </th>
                      <th scope="col" className="px-4 py-2.5" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {received?.customers.map((row) => (
                      <ReceivedCustomerTableRow
                        key={row.customerId}
                        row={row}
                        t={t}
                        isRtl={isRtl}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CustomerTableShell>
        </>
      )}
    </>
  );
}
