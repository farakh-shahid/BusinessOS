"use client";

import Link from "next/link";
import { Shirt } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { CustomerOrderHistoryItem } from "@shared";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { OrderWorkflowStatusBadge } from "@/features/ui/orders/order-workflow-status-badge";

interface CustomerOrderHistoryPanelProps {
  orders: CustomerOrderHistoryItem[];
  t: Dictionary;
  isRtl: boolean;
}

function formatRs(amount: number): string {
  return `Rs ${amount.toLocaleString()}`;
}

export function CustomerOrderHistoryPanel({
  orders,
  t,
  isRtl,
}: CustomerOrderHistoryPanelProps) {
  return (
    <Card className="border-hairline">
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <CardTitle>{t.search.orderHistory}</CardTitle>
        <span className="text-xs text-muted-slate">
          {t.customers.orderHistoryCount.replace(
            "{count}",
            String(orders.length),
          )}
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted-slate">{t.customers.noOrders}</p>
      ) : (
        <ul className="mt-4 divide-y divide-hairline">
          {orders.map((order) => {
            const settled = order.balanceDue <= 0;
            return (
              <li key={order.id}>
                <Link
                  href={routes.orderDetail(order.id)}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 py-3.5 transition hover:opacity-90",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <div className={cn("min-w-0", isRtl && "text-right")}>
                    <div
                      className={cn(
                        "flex flex-wrap items-center gap-2",
                        isRtl && "flex-row-reverse justify-end",
                      )}
                    >
                      <span className="font-display text-sm font-bold tabular-nums text-foreground">
                        #{order.orderNumber}
                      </span>
                      <OrderWorkflowStatusBadge
                        workflowStatus={order.workflowStatus}
                        t={t}
                        className="px-2 py-0.5 text-[10.5px]"
                      />
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-slate",
                        isRtl && "flex-row-reverse justify-end",
                      )}
                    >
                      <Shirt className="h-3 w-3 shrink-0 opacity-60" />
                      <span>{order.garmentLabel}</span>
                      <span aria-hidden>·</span>
                      <span>
                        {t.customers.bookedOn.replace(
                          "{date}",
                          order.bookingDate,
                        )}
                      </span>
                      <span aria-hidden>·</span>
                      <span>
                        {t.customers.dueOn.replace("{date}", order.deliveryDate)}
                      </span>
                      {order.cuttingMasterName || order.stitchingMasterName ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>
                            {t.customers.productionTeamSummary
                              .replace(
                                "{cutting}",
                                order.cuttingMasterName?.trim() || "—",
                              )
                              .replace(
                                "{stitching}",
                                order.stitchingMasterName?.trim() || "—",
                              )}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>

                  <div className={cn("shrink-0", isRtl ? "text-left" : "text-right")}>
                    <p className="font-display text-sm font-bold text-foreground">
                      {formatRs(order.totalPrice)}
                    </p>
                    {!settled ? (
                      <p className="mt-0.5 text-[11px] font-semibold text-status-urgent">
                        {t.customers.amountDue.replace(
                          "{amount}",
                          order.balanceDue.toLocaleString(),
                        )}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
