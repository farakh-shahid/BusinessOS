"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import type { Order } from "@shared";
import type { Dictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import {
  boardColumnBorderClass,
  boardColumnOrder,
  formatOrderDueShort,
  isActiveWorkflowStatus,
} from "@/features/infrastructure/data/order-list-ui";

interface OrderBoardViewProps {
  orders: Order[];
  t: Dictionary;
  isRtl?: boolean;
  className?: string;
}

function columnTitle(
  status: (typeof boardColumnOrder)[number],
  t: Dictionary,
): string {
  if (status === "pending") return t.orderList.boardBooked;
  return t.orderStatus[status];
}

export function OrderBoardView({
  orders,
  t,
  isRtl,
  className,
}: OrderBoardViewProps) {
  const boardOrders = orders.filter((order) =>
    isActiveWorkflowStatus(order.workflowStatus),
  );

  return (
    <div
      className={cn(
        "flex min-h-0 gap-3 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:thin] lg:grid lg:grid-cols-4 lg:overflow-hidden",
        isRtl && "flex-row-reverse lg:direction-rtl",
        className,
      )}
    >
      {boardColumnOrder.map((status) => {
        const columnOrders = boardOrders.filter(
          (order) => order.workflowStatus === status,
        );

        return (
          <div
            key={status}
            className="flex h-full min-h-0 min-w-[185px] flex-1 flex-col rounded-[13px] border border-hairline bg-card p-[11px] lg:min-w-0"
          >
            <div
              className={cn(
                "mb-2.5 flex shrink-0 items-center justify-between border-b border-hairline pb-2 text-[11.5px] font-bold text-foreground",
                isRtl && "flex-row-reverse",
              )}
            >
              <span>{columnTitle(status, t)}</span>
              <span className="rounded-full bg-background px-2 py-0.5 text-[10.5px] font-semibold text-muted-slate">
                {columnOrders.length}
              </span>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-0.5 [scrollbar-width:thin]">
              {columnOrders.length === 0 ? (
                <p className="px-1 py-2 text-[11px] text-muted-slate">
                  {t.orderList.boardEmpty}
                </p>
              ) : (
                columnOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={routes.orderDetail(order.id)}
                    className={cn(
                      "block rounded-[10px] border border-hairline border-t-[3px] bg-background p-2.5 transition-shadow hover:shadow-sm",
                      boardColumnBorderClass(status),
                    )}
                  >
                    <div
                      className={cn(
                        "flex flex-wrap items-center gap-1.5 text-xs font-semibold text-foreground",
                        isRtl && "flex-row-reverse justify-end",
                      )}
                    >
                      <PersonNameText name={order.customerName} />
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
                    <p className="mt-0.5 font-display text-[10px] text-muted-slate">
                      #{order.orderNumber}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-slate">
                      {order.items} · {formatOrderDueShort(order, t)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
