"use client";

import Link from "next/link";
import { Scissors, Shirt, UserRound } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { useLocale } from "@/core/i18n/locale-context";
import { useAssignmentsQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
import { AssignmentsSkeleton } from "@/tailor/ui/skeletons";

export function AssignmentsView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data, isLoading, isError } = useAssignmentsQuery();

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
          {t.assignments.title}
        </h2>
        <p className="text-sm text-slate-500">{t.assignments.subtitle}</p>
      </div>

      {isLoading ? (
        <AssignmentsSkeleton />
      ) : isError || !data ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : (
        <div className="space-y-4">
          {data.unassignedOrderCount > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="font-semibold text-amber-900">
                {t.assignments.unassigned}
              </p>
              <p className="mt-1 text-sm text-amber-800">
                {data.unassignedOrderCount} {t.assignments.activeOrders} ·{" "}
                {data.unassignedSuitCount} {t.assignments.activeSuits}
              </p>
              <p className="mt-1 text-xs text-amber-700">
                {t.assignments.unassignedSubtitle}
              </p>
            </div>
          ) : null}

          {data.assignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
              <Scissors className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                {t.assignments.noAssignments}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {t.assignments.noAssignmentsHint}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.assignments.map((row) => (
                <Card key={row.assignedToName}>
                  <div
                    className={cn(
                      "flex items-start justify-between gap-3",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "flex min-w-0 items-center gap-3",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div className={cn("min-w-0", isRtl && "text-right")}>
                        <CardTitle className="truncate text-base">
                          {row.assignedToName}
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                          {row.orderCount} {t.assignments.activeOrders} ·{" "}
                          {row.suitCount} {t.assignments.activeSuits}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={routes.ordersWithAssignedTo(row.assignedToName)}
                      className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      {t.assignments.viewOrders}
                    </Link>
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {row.orders.map((order) => (
                      <li key={order.id}>
                        <Link
                          href={routes.orderDetail(order.id)}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-slate-50",
                            isRtl && "flex-row-reverse",
                          )}
                        >
                          <div className={cn("min-w-0", isRtl && "text-right")}>
                            <p className="font-medium text-slate-800">
                              #{order.orderNumber} · {order.customerName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {order.garmentLabel}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "flex shrink-0 items-center gap-1 text-xs font-medium text-slate-600",
                              isRtl && "flex-row-reverse",
                            )}
                          >
                            <Shirt className="h-3.5 w-3.5" />
                            {order.suitCount}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
