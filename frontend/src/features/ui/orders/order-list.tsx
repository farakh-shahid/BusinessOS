"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Order, OrderWorkflowStatus } from "@shared";
import { getDictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { canChangeOrderStatus, canDeliverOrders, isAdminRole, isTailorRole } from "@/core/auth/roles";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import {
  useUpdateOrderStatusMutation,
} from "@/features/infrastructure/api/hooks/use-orders";
import { useToast } from "@/core/presentation/components/ui/toast";
import { DeliverDialog } from "./deliver-dialog";
import { MarkReadyConfirmSheet } from "./mark-ready-confirm-sheet";
import { MarkReadyDialog } from "./mark-ready-dialog";
import { OrderCard } from "./order-card";
import { ReopenOrderStatusDialog } from "./reopen-order-status-dialog";
import { needsDeliveredReopenConfirm } from "@/features/infrastructure/data/order-workflow";

interface OrderListProps {
  orders: Order[];
  showViewAll?: boolean;
  enableMarkReady?: boolean;
  enableStatusChange?: boolean;
}

interface UndoMarkReadyState {
  orderId: string;
  previousStatus: OrderWorkflowStatus;
}

interface ReopenStatusState {
  orderId: string;
  orderNumber: string;
  status: OrderWorkflowStatus;
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
  const canDeliver = canDeliverOrders(user?.role);
  const canChangeStatus = canChangeOrderStatus(user?.role);
  const canMarkReadyAction =
    isAdminRole(user?.role) || isTailorRole(user?.role);
  const updateStatus = useUpdateOrderStatusMutation();
  const { showSuccess, showError } = useToast();
  const [markReadyConfirmOrder, setMarkReadyConfirmOrder] = useState<Order | null>(
    null,
  );
  const [markReadyOrderId, setMarkReadyOrderId] = useState<string | null>(null);
  const [undoMarkReady, setUndoMarkReady] = useState<UndoMarkReadyState | null>(
    null,
  );
  const [undoPending, setUndoPending] = useState(false);
  const [deliverOrderId, setDeliverOrderId] = useState<string | null>(null);
  const [reopenConfirm, setReopenConfirm] = useState<ReopenStatusState | null>(
    null,
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!undoMarkReady) return;
    const timer = window.setTimeout(() => setUndoMarkReady(null), 8000);
    return () => window.clearTimeout(timer);
  }, [undoMarkReady]);

  async function applyStatusChange(
    orderId: string,
    status: OrderWorkflowStatus,
  ) {
    if (status === "delivered" && canDeliver) {
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

  async function handleStatusChange(
    orderId: string,
    status: OrderWorkflowStatus,
  ) {
    const order = orders.find((item) => item.id === orderId);
    if (
      order &&
      needsDeliveredReopenConfirm(order.workflowStatus, status)
    ) {
      setReopenConfirm({
        orderId,
        orderNumber: order.orderNumber,
        status,
      });
      return;
    }

    await applyStatusChange(orderId, status);
  }

  async function handleConfirmReopen() {
    if (!reopenConfirm) return;
    const { orderId, status } = reopenConfirm;
    setReopenConfirm(null);
    await applyStatusChange(orderId, status);
  }

  async function handleUndoMarkReady() {
    if (!undoMarkReady || undoPending) return;

    setUndoPending(true);
    try {
      await updateStatus.mutateAsync({
        orderId: undoMarkReady.orderId,
        payload: { status: undoMarkReady.previousStatus },
      });
      setUndoMarkReady(null);
      showSuccess(t.orders.markReadyUndone);
    } catch {
      showError(t.common.error);
    } finally {
      setUndoPending(false);
    }
  }

  return (
    <section className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          userRole={user?.role}
          statusUpdating={updatingOrderId === order.id}
          href={routes.orderDetail(order.id)}
          onMarkReady={
            enableMarkReady && canMarkReadyAction
              ? (id) => {
                  const target = orders.find((o) => o.id === id);
                  if (target) setMarkReadyConfirmOrder(target);
                }
              : undefined
          }
          onStatusChange={
            enableStatusChange && canChangeStatus ? handleStatusChange : undefined
          }
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

      <MarkReadyConfirmSheet
        order={markReadyConfirmOrder}
        t={t}
        isRtl={isRtl}
        onCancel={() => setMarkReadyConfirmOrder(null)}
        onConfirm={() => {
          if (markReadyConfirmOrder) {
            setMarkReadyOrderId(markReadyConfirmOrder.id);
          }
          setMarkReadyConfirmOrder(null);
        }}
      />

      <MarkReadyDialog
        orderId={markReadyOrderId}
        onClose={() => setMarkReadyOrderId(null)}
        onMarked={({ orderId, previousStatus }) => {
          setMarkReadyOrderId(null);
          if (previousStatus !== "ready") {
            setUndoMarkReady({ orderId, previousStatus });
          }
        }}
      />

      <DeliverDialog
        orderId={deliverOrderId}
        onClose={() => setDeliverOrderId(null)}
      />

      <ReopenOrderStatusDialog
        orderNumber={reopenConfirm?.orderNumber ?? null}
        targetStatus={reopenConfirm?.status ?? null}
        isPending={updatingOrderId === reopenConfirm?.orderId}
        onClose={() => setReopenConfirm(null)}
        onConfirm={() => void handleConfirmReopen()}
      />

      {undoMarkReady ? (
        <div
          className={cn(
            "fixed inset-x-4 bottom-20 z-[100] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-lg sm:bottom-6",
            isRtl && "flex-row-reverse",
          )}
          role="status"
        >
          <p className="min-w-0 flex-1 font-medium">{t.orders.markReadyUndoPrompt}</p>
          <button
            type="button"
            onClick={() => void handleUndoMarkReady()}
            disabled={undoPending}
            className="shrink-0 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {undoPending ? t.common.loading : t.orders.markReadyUndo}
          </button>
        </div>
      ) : null}
    </section>
  );
}
