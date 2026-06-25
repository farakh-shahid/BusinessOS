"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  emptyMeasurementsForGarment,
  emptyStyleForGarment,
  mergeMeasurementsForGarmentChange,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@shared";
import { getDictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { routes } from "@/core/config/routes";
import { canCreateOrders } from "@/core/auth/roles";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import {
  useCustomerDetailQuery,
} from "@/features/infrastructure/api/hooks/use-customers";
import { fetchCustomerByPhone } from "@/features/infrastructure/api/customers.api";
import {
  useAssignmentsQuery,
  useCreateOrderMutation,
  useNextOrderNumberQuery,
} from "@/features/infrastructure/api/hooks/use-orders";
import { buildAssigneeWorkloadMap } from "@/features/infrastructure/data/assignee-workload";
import {
  patchFromCustomerDetail,
  resetDressFieldsForNewOrder,
} from "@/features/infrastructure/data/customer-measurement-patch";
import {
  emptyNewOrderDraft,
  type NewOrderDraft,
} from "@/features/infrastructure/data/new-order.mock";
import {
  validateNewOrderDraft,
  type NewOrderFieldErrors,
} from "@/features/infrastructure/data/new-order-validation";
import {
  CustomerSection,
  type CustomerSectionHandle,
} from "@/features/ui/customers/customer-section";
import { MeasurementFieldsForm } from "@/features/ui/measurements/measurement-fields-form";
import { StyleSpecsForm } from "@/features/ui/measurements/style-specs-form";
import { CustomerSavedMeasurementsPanel } from "@/features/ui/orders/customer-saved-measurements-panel";
import { GarmentTypeSection } from "@/features/ui/orders/garment-type-section";
import { OrderDetailsSection } from "@/features/ui/orders/order-details-section";
import { OrderReceiptDialog } from "@/features/ui/orders/order-receipt-dialog";
import {
  WorksheetPanel,
  WorksheetSectionTitle,
} from "@/features/ui/orders/worksheet-form-primitives";

export function NewOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerSectionRef = useRef<CustomerSectionHandle>(null);
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user, isLoading: userLoading } = useMeQuery();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (userLoading) return;
    if (user && !canCreateOrders(user.role)) {
      router.replace(routes.orders);
    }
  }, [user, userLoading, router]);
  const createOrder = useCreateOrderMutation();
  const { data: nextOrderNumber } = useNextOrderNumberQuery();
  const { data: assignments } = useAssignmentsQuery();
  const assigneeWorkload = useMemo(
    () => buildAssigneeWorkloadMap(assignments),
    [assignments],
  );
  const [draft, setDraft] = useState<NewOrderDraft>(emptyNewOrderDraft);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<NewOrderFieldErrors>({});
  const [receiptOrderId, setReceiptOrderId] = useState<string | null>(null);
  const lastHydratedCustomerId = useRef<string | null>(null);
  const dressCodePrefilled = useRef(false);

  const patch = useCallback((update: Partial<NewOrderDraft>) => {
    setDraft((prev) => {
      if (update.customerId && update.customerId !== prev.customerId) {
        lastHydratedCustomerId.current = null;
      }
      if (update.customerMode === "new") {
        lastHydratedCustomerId.current = null;
      }
      return { ...prev, ...update };
    });
    setError(null);
    setFieldErrors({});
  }, []);

  const presetCustomerId = searchParams.get("customerId");
  const lockToExistingCustomer = Boolean(presetCustomerId);

  const customerDetailQuery = useCustomerDetailQuery(
    draft.customerMode === "existing" && draft.customerId
      ? draft.customerId
      : null,
  );

  useEffect(() => {
    const customerId = presetCustomerId;
    if (customerId) {
      lastHydratedCustomerId.current = null;
      setDraft((prev) => ({
        ...prev,
        customerMode: "existing",
        customerId,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDraft((prev) =>
      prev.bookingDate === today ? prev : { ...prev, bookingDate: today },
    );
  }, []);

  useEffect(() => {
    if (!nextOrderNumber?.orderNumber || dressCodePrefilled.current) return;
    dressCodePrefilled.current = true;
    setDraft((prev) => ({
      ...prev,
      dressCode: prev.dressCode.trim()
        ? prev.dressCode
        : nextOrderNumber.orderNumber,
    }));
  }, [nextOrderNumber]);

  useEffect(() => {
    if (draft.customerMode !== "existing" || !draft.customerId) {
      lastHydratedCustomerId.current = null;
      return;
    }

    const detail = customerDetailQuery.data;
    if (!detail || detail.customer.id !== draft.customerId) return;
    if (lastHydratedCustomerId.current === draft.customerId) return;

    lastHydratedCustomerId.current = draft.customerId;
    setDraft((prev) => {
      const suitType = normalizeBookingGarmentType(prev.garmentType);
      return {
        ...prev,
        garmentType: suitType,
        ...resetDressFieldsForNewOrder(suitType),
        dressCode: nextOrderNumber?.orderNumber ?? "",
        ...patchFromCustomerDetail(detail, suitType),
      };
    });
    setError(null);
  }, [draft.customerMode, draft.customerId, customerDetailQuery.data, nextOrderNumber]);

  function handleGarmentChange(garmentType: BookingGarmentType) {
    if (garmentType === draft.garmentType) return;

    setDraft((prev) => {
      const detail = customerDetailQuery.data;
      const fromCustomer =
        prev.customerMode === "existing" &&
        prev.customerId &&
        detail?.customer.id === prev.customerId
          ? patchFromCustomerDetail(detail, garmentType)
          : null;

      return {
        ...prev,
        garmentType,
        measurements:
          fromCustomer?.measurements ??
          mergeMeasurementsForGarmentChange(garmentType, prev.measurements),
        style:
          fromCustomer?.style ?? emptyStyleForGarment(garmentType),
      };
    });
    setError(null);
  }

  function handleClearMeasurements() {
    const suitType = normalizeBookingGarmentType(draft.garmentType);
    patch({
      measurements: emptyMeasurementsForGarment(suitType),
      style: emptyStyleForGarment(suitType),
    });
  }

  async function handleSave() {
    setError(null);
    setFieldErrors({});

    if (draft.customerMode === "new") {
      const valid = await customerSectionRef.current?.validateNewCustomer();
      if (!valid) return;
    }

    const validation = validateNewOrderDraft(draft, t);
    if (!validation.valid) {
      setFieldErrors(validation.fields);
      setError(validation.summary);
      showError(validation.summary ?? t.validation.fixFormErrors);
      validation.firstFieldId &&
        document.getElementById(validation.firstFieldId)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      return;
    }

    try {
      const created = await createOrder.mutateAsync(draft);
      showSuccess(t.common.saved);
      setReceiptOrderId(created.id);
    } catch (err) {
      const msg = resolveApiErrorMessage(err, t);
      setError(msg);
      if (/phone number already exists|already registered/i.test(msg)) {
        const existing = await fetchCustomerByPhone(draft.customerPhone);
        setFieldErrors({ customerPhone: msg });
        if (existing) {
          patch({
            customerMode: "existing",
            customerId: existing.id,
          });
        }
        document.getElementById("customer-phone")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      showError(msg);
    }
  }

  return (
    <div className="space-y-6">
      <div className={cn(isRtl && "text-right")}>
        <Link
          href={routes.dashboard}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          ← {t.nav.dashboard}
        </Link>
        <h2 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
          {t.form.newOrder}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t.form.newOrderSubtitle}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {customerDetailQuery.isFetching &&
        draft.customerMode === "existing" &&
        draft.customerId && (
          <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
            {t.form.loadingCustomerData}
          </div>
        )}

      <WorksheetPanel className="space-y-8">
        <WorksheetSectionTitle>{t.form.newOrderWorksheetTitle}</WorksheetSectionTitle>

        <CustomerSection
          ref={customerSectionRef}
          t={t}
          draft={draft}
          selectedCustomer={customerDetailQuery.data?.customer ?? null}
          onChange={patch}
          isRtl={isRtl}
          fieldErrors={fieldErrors}
          variant="worksheet"
          lockToExistingCustomer={lockToExistingCustomer}
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <GarmentTypeSection
            t={t}
            value={draft.garmentType}
            onChange={handleGarmentChange}
            isRtl={isRtl}
            variant="worksheet"
          />
          <OrderDetailsSection
            t={t}
            draft={draft}
            onChange={patch}
            isRtl={isRtl}
            assigneeSuggestions={assignments?.assignees ?? []}
            assigneeWorkload={assigneeWorkload}
            fieldErrors={fieldErrors}
            variant="worksheet"
            fieldPlacement="primary"
          />
        </div>

        {draft.customerMode === "existing" &&
        draft.customerId &&
        customerDetailQuery.data?.customer.id === draft.customerId ? (
          <CustomerSavedMeasurementsPanel
            detail={{
              ...customerDetailQuery.data,
              savedMeasurements:
                customerDetailQuery.data.savedMeasurements ?? [],
            }}
            garmentType={draft.garmentType}
            measurements={draft.measurements}
            t={t}
            isRtl={isRtl}
            onClear={handleClearMeasurements}
            onSelectGarment={handleGarmentChange}
          />
        ) : null}

        <MeasurementFieldsForm
          t={t}
          garmentType={draft.garmentType}
          measurements={draft.measurements}
          onChange={(measurements) => patch({ measurements })}
          fieldErrors={fieldErrors}
          variant="worksheet"
        />

        <StyleSpecsForm
          t={t}
          garmentType={draft.garmentType}
          style={draft.style}
          onChange={(style) => patch({ style })}
          variant="worksheet"
        />

        <OrderDetailsSection
          t={t}
          draft={draft}
          onChange={patch}
          isRtl={isRtl}
          assigneeSuggestions={assignments?.assignees ?? []}
          assigneeWorkload={assigneeWorkload}
          fieldErrors={fieldErrors}
          variant="worksheet"
          fieldPlacement="secondary"
        />
      </WorksheetPanel>

      <div
        className={cn(
          "flex flex-col gap-3 pb-4 sm:flex-row sm:justify-end",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <Link
          href={routes.orders}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
        >
          {t.form.cancel}
        </Link>
        <Button
          className="w-full sm:w-auto"
          onClick={handleSave}
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? t.common.loading : t.form.save}
        </Button>
      </div>

      <OrderReceiptDialog
        orderId={receiptOrderId}
        title={t.receipt.postOrderTitle}
        subtitle={t.receipt.postOrderSubtitle}
        autoSendPdfs
        onClose={() => {
          const id = receiptOrderId;
          setReceiptOrderId(null);
          if (id) {
            router.replace(routes.orderDetail(id));
          } else {
            router.replace(routes.orders);
          }
          router.refresh();
        }}
      />
    </div>
  );
}
