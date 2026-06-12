"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  emptyStyleForGarment,
  mergeMeasurementsForGarmentChange,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { routes } from "@/core/config/routes";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import {
  useCustomerDetailQuery,
  useCustomersQuery,
} from "@/tailor/infrastructure/api/hooks/use-customers";
import {
  useAssignmentsQuery,
  useCreateOrderMutation,
} from "@/tailor/infrastructure/api/hooks/use-orders";
import {
  patchFromCustomerDetail,
  resetDressFieldsForNewOrder,
} from "@/tailor/infrastructure/data/customer-measurement-patch";
import {
  emptyNewOrderDraft,
  type NewOrderDraft,
} from "@/tailor/infrastructure/data/new-order.mock";
import { getNewOrderValidationError } from "@/tailor/infrastructure/data/new-order-validation";
import {
  CustomerSection,
  type CustomerSectionHandle,
} from "@/tailor/ui/customers/customer-section";
import { MeasurementFieldsForm } from "@/tailor/ui/measurements/measurement-fields-form";
import { StyleSpecsForm } from "@/tailor/ui/measurements/style-specs-form";
import { GarmentTypeSection } from "@/tailor/ui/orders/garment-type-section";
import { OrderDetailsSection } from "@/tailor/ui/orders/order-details-section";
import { NewOrderFormSkeleton } from "@/tailor/ui/skeletons";

export function NewOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerSectionRef = useRef<CustomerSectionHandle>(null);
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: customers = [], isLoading: customersLoading } = useCustomersQuery();
  const { showError, showSuccess } = useToast();
  const createOrder = useCreateOrderMutation();
  const { data: assignments } = useAssignmentsQuery();
  const [draft, setDraft] = useState<NewOrderDraft>(emptyNewOrderDraft);
  const [error, setError] = useState<string | null>(null);
  const lastHydratedCustomerId = useRef<string | null>(null);

  const validationError = useMemo(
    () => getNewOrderValidationError(draft, t),
    [draft, t],
  );
  const canSave = !validationError && !createOrder.isPending;

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
  }, []);

  const customerDetailQuery = useCustomerDetailQuery(
    draft.customerMode === "existing" && draft.customerId
      ? draft.customerId
      : null,
  );

  useEffect(() => {
    const customerId = searchParams.get("customerId");
    if (customerId) {
      lastHydratedCustomerId.current = null;
      setDraft((prev) => ({
        ...prev,
        customerMode: "existing",
        customerId,
      }));
      return;
    }

    if (customers.length > 0 && !draft.customerId) {
      lastHydratedCustomerId.current = null;
      setDraft((prev) => ({ ...prev, customerId: customers[0]!.id }));
    }
  }, [customers, draft.customerId, searchParams]);

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
        ...patchFromCustomerDetail(detail, suitType),
      };
    });
    setError(null);
  }, [draft.customerMode, draft.customerId, customerDetailQuery.data]);

  function handleGarmentChange(garmentType: BookingGarmentType) {
    if (garmentType === draft.garmentType) return;

    setDraft((prev) => ({
      ...prev,
      garmentType,
      measurements: mergeMeasurementsForGarmentChange(
        garmentType,
        prev.measurements,
      ),
      style: emptyStyleForGarment(garmentType),
    }));
    setError(null);
  }

  async function handleSave() {
    setError(null);

    if (draft.customerMode === "new") {
      const valid = await customerSectionRef.current?.validateNewCustomer();
      if (!valid) return;
    }

    const validationMessage = getNewOrderValidationError(draft, t);
    if (validationMessage) {
      setError(validationMessage);
      showError(validationMessage);
      return;
    }

    try {
      await createOrder.mutateAsync(draft);
      showSuccess(t.common.saved);
      router.replace(routes.orders);
      router.refresh();
    } catch (err) {
      const msg = resolveApiErrorMessage(err, t);
      setError(msg);
      showError(msg);
    }
  }

  if (customersLoading) {
    return <NewOrderFormSkeleton />;
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

      <CustomerSection
        ref={customerSectionRef}
        t={t}
        draft={draft}
        customers={customers}
        onChange={patch}
        isRtl={isRtl}
      />

      <GarmentTypeSection
        t={t}
        value={draft.garmentType}
        onChange={handleGarmentChange}
        isRtl={isRtl}
      />

      <MeasurementFieldsForm
        t={t}
        garmentType={draft.garmentType}
        measurements={draft.measurements}
        onChange={(measurements) => patch({ measurements })}
      />

      <StyleSpecsForm
        t={t}
        garmentType={draft.garmentType}
        style={draft.style}
        onChange={(style) => patch({ style })}
      />

      <OrderDetailsSection
        t={t}
        draft={draft}
        onChange={patch}
        isRtl={isRtl}
        assigneeSuggestions={assignments?.assignees ?? []}
      />

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
          disabled={!canSave}
        >
          {createOrder.isPending ? t.common.loading : t.form.save}
        </Button>
      </div>
    </div>
  );
}
