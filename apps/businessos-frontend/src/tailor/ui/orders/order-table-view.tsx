"use client";

import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import type { Order } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { formatRs } from "@/tailor/ui/analytics/format";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import {
  formatOrderDueShort,
  phoneTelHref,
} from "@/tailor/infrastructure/data/order-list-ui";
import { OrderWorkflowStatusBadge } from "./order-workflow-status-badge";

interface OrderTableViewProps {
  orders: Order[];
  t: Dictionary;
  isRtl?: boolean;
}

export function OrderTableView({ orders, t, isRtl }: OrderTableViewProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="rounded-[13px] border border-dashed border-hairline bg-card px-4 py-10 text-center text-sm text-muted-slate">
        {t.orderList.tableEmpty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[13px] border border-hairline bg-card">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-hairline bg-background">
            {(
              [
                "columnCustomer",
                "columnOrder",
                "columnItem",
                "columnStatus",
                "columnDue",
                "columnBalance",
              ] as const
            ).map((key) => (
              <th
                key={key}
                className={cn(
                  "px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-slate",
                  isRtl && "text-right",
                  key === "columnBalance" && "text-right",
                )}
              >
                {t.orderList[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const balance = order.balanceDue ?? 0;
            const settled = balance <= 0;

            return (
              <tr
                key={order.id}
                onClick={() => router.push(routes.orderDetail(order.id))}
                className="cursor-pointer border-b border-hairline last:border-b-0 hover:bg-background"
              >
                <td className={cn("px-3.5 py-2", isRtl && "text-right")}>
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-1.5",
                      isRtl && "flex-row-reverse justify-end",
                    )}
                  >
                    <span className="font-semibold text-foreground">
                      <PersonNameText name={order.customerName} />
                    </span>
                    {order.isRush ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-full bg-status-urgent-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-status-urgent",
                          isRtl && "flex-row-reverse",
                        )}
                      >
                        <Zap className="h-2.5 w-2.5" />
                        {t.orderDetail.rush}
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-slate",
                      isRtl && "flex-row-reverse justify-end",
                    )}
                  >
                    <a
                      href={phoneTelHref(order.customerPhone)}
                      className="font-medium text-brand-700 hover:underline"
                      dir="ltr"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.customerPhone}
                    </a>
                    {order.dressCode ? (
                      <>
                        <span aria-hidden>·</span>
                        <span>
                          {t.form.dressCode}: {order.dressCode}
                        </span>
                      </>
                    ) : null}
                  </p>
                </td>
                <td
                  className={cn(
                    "px-3.5 py-2 font-display text-[11.5px] text-muted-slate",
                    isRtl && "text-right",
                  )}
                >
                  <span className="tabular-nums">#{order.orderNumber}</span>
                  <span aria-hidden className="mx-1 text-slate-300">
                    ·
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {t.orderList.boardBooked}
                  </span>{" "}
                  <span className="font-medium text-slate-600">{order.bookingDate}</span>
                </td>
                <td
                  className={cn(
                    "px-3.5 py-2 text-[12.5px] text-foreground",
                    isRtl && "text-right",
                  )}
                >
                  {order.items}
                </td>
                <td className="px-3.5 py-2">
                  <OrderWorkflowStatusBadge
                    workflowStatus={order.workflowStatus}
                    t={t}
                  />
                </td>
                <td
                  className={cn(
                    "px-3.5 py-2 text-[12.5px] text-foreground",
                    isRtl && "text-right",
                  )}
                >
                  {formatOrderDueShort(order, t)}
                </td>
                <td
                  className={cn(
                    "px-3.5 py-2 text-right text-[12.5px] font-semibold",
                    settled ? "text-status-ready" : "text-status-urgent",
                  )}
                >
                  {formatRs(balance)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
