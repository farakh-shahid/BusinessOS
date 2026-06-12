"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Order, OrderWorkflowStatus } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { isAdminRole } from "@/core/auth/roles";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import {
  useAssignmentsQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
} from "@/tailor/infrastructure/api/hooks/use-orders";
import { DeliverDialog } from "./deliver-dialog";
import { MarkReadyDialog } from "./mark-ready-dialog";
import { OrderCard } from "./order-card";

interface OrderListProps {
  orders: Order[];
  showViewAll?: boolean;
  enableMarkReady?: boolean;
  enableStatusChange?: boolean;
}

export function OrderList({
  orders,
  showViewAll = true,
  enableMarkReady = true,
  enableStatusChange = true,
}: OrderListProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";
  const t = getDictionary(locale);
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);
  const updateStatus = useUpdateOrderStatusMutation();
  const updateOrder = useUpdateOrderMutation();
  const { data: assignments } = useAssignmentsQuery();
  const [markReadyOrderId, setMarkReadyOrderId] = useState<string | null>(null);
  const [deliverOrderId, setDeliverOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  async function handleStatusChange(
    orderId: string,
    status: OrderWorkflowStatus,
  ) {
    if (status === "delivered" && isAdmin) {
      setDeliverOrderId(orderId);
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await updateStatus.mutateAsync({
        orderId,
        payload: { status },
      });
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleAssignChange(orderId: string, assignedToName: string) {
    setAssigningOrderId(orderId);
    try {
      await updateOrder.mutateAsync({
        orderId,
        payload: { assignedToName },
      });
    } finally {
      setAssigningOrderId(null);
    }
  }

  return (
    <section className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isAdmin={isAdmin}
          statusUpdating={updatingOrderId === order.id}
          href={routes.orderDetail(order.id)}
          onMarkReady={
            enableMarkReady ? (id) => setMarkReadyOrderId(id) : undefined
          }
          onStatusChange={
            enableStatusChange ? handleStatusChange : undefined
          }
          assigneeSuggestions={assignments?.assignees ?? []}
          onAssignChange={
            enableStatusChange ? handleAssignChange : undefined
          }
          assignmentUpdating={assigningOrderId === order.id}
        />
      ))}

      {showViewAll && (
        <Link
          href={routes.orders}
          className={cn(
            "mb-16 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50 md:mb-0",
            isRtl && "flex-row-reverse",
          )}
        >
          {t.orders.viewAll}
          <ChevronRight
            className={cn("h-4 w-4 shrink-0", isRtl && "rotate-180")}
          />
        </Link>
      )}

      <MarkReadyDialog
        orderId={markReadyOrderId}
        onClose={() => setMarkReadyOrderId(null)}
      />
      <DeliverDialog
        orderId={deliverOrderId}
        onClose={() => setDeliverOrderId(null)}
      />
    </section>
  );
}
