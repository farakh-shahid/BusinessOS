"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dictionary } from "@business-os/i18n";
import type { TailorCustomer } from "@business-os/tailor";
import { cn } from "@/core/presentation/lib/utils";
import { routes } from "@/core/config/routes";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { Button } from "@/core/presentation/components/ui/button";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import type { NewOrderDraft } from "@/tailor/infrastructure/data/new-order.mock";
import type { NewOrderFieldErrors } from "@/tailor/infrastructure/data/new-order-validation";
import { useCustomerByPhoneQuery } from "@/tailor/infrastructure/api/hooks/use-customer-lookup";
import { AsyncCustomerSelect } from "@/tailor/ui/customers/async-customer-select";
import {
  createNewCustomerSchema,
  type NewCustomerFormValues,
} from "@/tailor/ui/customers/new-customer.schema";
import {
  WorksheetField,
  worksheetFieldClass,
  worksheetInputClass,
} from "@/tailor/ui/orders/worksheet-form-primitives";

export interface CustomerSectionHandle {
  validateNewCustomer: () => Promise<boolean>;
}

interface CustomerSectionProps {
  t: Dictionary;
  draft: NewOrderDraft;
  selectedCustomer?: TailorCustomer | null;
  onChange: (patch: Partial<NewOrderDraft>) => void;
  isRtl: boolean;
  fieldErrors?: NewOrderFieldErrors;
  variant?: "default" | "worksheet";
}

export const CustomerSection = forwardRef<
  CustomerSectionHandle,
  CustomerSectionProps
>(function CustomerSection(
  { t, draft, selectedCustomer = null, onChange, isRtl, fieldErrors = {}, variant = "default" },
  ref,
) {
  const isWorksheet = variant === "worksheet";
  const schema = createNewCustomerSchema({
    nameRequired: t.validation.nameRequired,
    phoneRequired: t.validation.phoneRequired,
    phoneInvalid: t.validation.phoneInvalid,
    emailInvalid: t.validation.emailInvalid,
  });

  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useForm<NewCustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: draft.customerName,
      customerPhone: draft.customerPhone,
      customerEmail: draft.customerEmail,
    },
    mode: "onTouched",
  });

  const customerName = watch("customerName");
  const customerPhone = watch("customerPhone");
  const customerEmail = watch("customerEmail");

  useEffect(() => {
    if (draft.customerMode !== "new") return;

    const nextName = customerName ?? "";
    const nextPhone = customerPhone ?? "";
    const nextEmail = customerEmail ?? "";

    if (
      nextName === draft.customerName &&
      nextPhone === draft.customerPhone &&
      nextEmail === draft.customerEmail
    ) {
      return;
    }

    onChange({
      customerName: nextName,
      customerPhone: nextPhone,
      customerEmail: nextEmail,
    });
  }, [
    customerName,
    customerPhone,
    customerEmail,
    draft.customerMode,
    draft.customerName,
    draft.customerPhone,
    draft.customerEmail,
    onChange,
  ]);

  useImperativeHandle(ref, () => ({
    validateNewCustomer: async () => {
      if (draft.customerMode !== "new") return true;
      return trigger();
    },
  }));

  const phoneLookup = useCustomerByPhoneQuery(
    customerPhone ?? "",
    draft.customerMode === "new",
  );
  const duplicateCustomer = phoneLookup.data ?? undefined;

  function useExistingCustomer() {
    if (!duplicateCustomer) return;
    onChange({
      customerMode: "existing",
      customerId: duplicateCustomer.id,
    });
  }

  const asyncSelectCommon = {
    id: "customer-select",
    value: draft.customerId,
    selectedCustomer,
    onChange: (customerId: string) => onChange({ customerId }),
    placeholder: t.form.selectCustomer,
    searchPlaceholder: t.form.searchCustomer,
    emptyMessage: t.form.noCustomersFound,
    searchHint: t.form.searchCustomerHint,
    searchingLabel: t.form.searchingCustomers,
    isRtl,
    "aria-label": t.form.selectCustomer,
  } as const;

  const existingCustomerFields = isWorksheet ? (
    <>
      <WorksheetField
        label={t.form.selectCustomer}
        htmlFor="customer-select"
        error={fieldErrors.customerId}
      >
        <AsyncCustomerSelect
          {...asyncSelectCommon}
          buttonClassName={cn(
            worksheetInputClass,
            "justify-between font-normal text-slate-900",
            fieldErrors.customerId && worksheetFieldClass(true),
          )}
        />
      </WorksheetField>
      {selectedCustomer ? (
        <WorksheetField label={t.form.phone}>
          <Input
            readOnly
            value={selectedCustomer.phone}
            dir="ltr"
            className={worksheetFieldClass()}
            tabIndex={-1}
          />
        </WorksheetField>
      ) : null}
    </>
  ) : (
    <div className="mt-4">
      <Label htmlFor="customer-select">{t.form.selectCustomer}</Label>
      <AsyncCustomerSelect {...asyncSelectCommon} />
      {fieldErrors.customerId ? (
        <FormFieldError message={fieldErrors.customerId} />
      ) : null}
    </div>
  );

  const modeToggle = (
    <div
      className={cn("border-b border-hairline", isWorksheet ? "mb-5" : "mt-4")}
      role="tablist"
      aria-label={t.form.customer}
    >
      <div className={cn("flex gap-6 sm:gap-8", isRtl && "flex-row-reverse")}>
        <button
          type="button"
          role="tab"
          aria-selected={draft.customerMode === "existing"}
          onClick={() => onChange({ customerMode: "existing" })}
          className={cn(
            "-mb-px shrink-0 border-b-2 pb-3 pt-1 text-sm font-semibold transition-colors",
            draft.customerMode === "existing"
              ? "border-accent-500 text-foreground"
              : "border-transparent text-muted-slate hover:text-foreground",
          )}
        >
          {t.form.existingCustomer}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={draft.customerMode === "new"}
          onClick={() => onChange({ customerMode: "new" })}
          className={cn(
            "-mb-px shrink-0 border-b-2 pb-3 pt-1 text-sm font-semibold transition-colors",
            draft.customerMode === "new"
              ? "border-accent-500 text-foreground"
              : "border-transparent text-muted-slate hover:text-foreground",
          )}
        >
          {t.form.newCustomer}
        </button>
      </div>
    </div>
  );

  const newCustomerFields = isWorksheet ? (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">{t.form.phoneUniqueHint}</p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <WorksheetField
          label={t.form.name}
          htmlFor="customer-name"
          required
          error={errors.customerName?.message ?? fieldErrors.customerName}
        >
          <Input
            id="customer-name"
            aria-invalid={!!errors.customerName || !!fieldErrors.customerName}
            className={worksheetFieldClass(
              !!(errors.customerName || fieldErrors.customerName),
            )}
            {...register("customerName")}
          />
        </WorksheetField>
        <WorksheetField
          label={t.form.phone}
          htmlFor="customer-phone"
          required
          hint={t.form.phoneHint}
          error={errors.customerPhone?.message ?? fieldErrors.customerPhone}
        >
          <Input
            id="customer-phone"
            type="tel"
            placeholder={t.form.phonePlaceholder}
            aria-invalid={!!errors.customerPhone || !!fieldErrors.customerPhone}
            dir="ltr"
            className={worksheetFieldClass(
              !!(errors.customerPhone || fieldErrors.customerPhone),
            )}
            {...register("customerPhone")}
          />
        </WorksheetField>
        <div className="sm:col-span-2">
          <WorksheetField
            label={t.form.email}
            htmlFor="customer-email"
            hint={t.form.emailHint}
            error={errors.customerEmail?.message}
          >
            <Input
              id="customer-email"
              type="email"
              aria-invalid={!!errors.customerEmail}
              className={worksheetFieldClass(!!errors.customerEmail)}
              {...register("customerEmail")}
            />
          </WorksheetField>
        </div>
      </div>
      {duplicateCustomer ? (
        <div
          className={cn(
            "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900",
            isRtl && "text-right",
          )}
        >
          <p>
            {t.form.phoneRegisteredTo.replace("{name}", duplicateCustomer.name)}
          </p>
          <div
            className={cn(
              "mt-3 flex flex-wrap gap-2",
              isRtl && "flex-row-reverse",
            )}
          >
            <Button
              type="button"
              className="h-9 min-h-9 px-3"
              onClick={useExistingCustomer}
            >
              {t.form.useExistingCustomer}
            </Button>
            <Link
              href={routes.customerEdit(duplicateCustomer.id)}
              className="inline-flex h-9 items-center rounded-xl border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              {t.form.editCustomerDetails}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="mt-4 space-y-3">
      <p className="text-xs text-slate-500">{t.form.phoneUniqueHint}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="customer-name">
            {t.form.name} <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="customer-name"
            aria-invalid={!!errors.customerName || !!fieldErrors.customerName}
            className={
              errors.customerName || fieldErrors.customerName
                ? "border-rose-300 focus-visible:ring-rose-400"
                : undefined
            }
            {...register("customerName")}
          />
          <FormFieldError
            message={errors.customerName?.message ?? fieldErrors.customerName}
          />
        </div>
        <div>
          <Label htmlFor="customer-phone">
            {t.form.phone} <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="customer-phone"
            type="tel"
            placeholder={t.form.phonePlaceholder}
            aria-invalid={!!errors.customerPhone || !!fieldErrors.customerPhone}
            dir="ltr"
            className={
              errors.customerPhone || fieldErrors.customerPhone
                ? "border-rose-300 focus-visible:ring-rose-400"
                : undefined
            }
            {...register("customerPhone")}
          />
          <p className="mt-1 text-xs text-slate-400">{t.form.phoneHint}</p>
          <FormFieldError
            message={errors.customerPhone?.message ?? fieldErrors.customerPhone}
          />
        </div>
        <div>
          <Label htmlFor="customer-email">{t.form.email}</Label>
          <Input
            id="customer-email"
            type="email"
            aria-invalid={!!errors.customerEmail}
            {...register("customerEmail")}
          />
          <p className="mt-1 text-xs text-slate-400">{t.form.emailHint}</p>
          <FormFieldError message={errors.customerEmail?.message} />
        </div>
      </div>

      {duplicateCustomer ? (
        <div
          className={cn(
            "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900",
            isRtl && "text-right",
          )}
        >
          <p>
            {t.form.phoneRegisteredTo.replace("{name}", duplicateCustomer.name)}
          </p>
          <div
            className={cn(
              "mt-3 flex flex-wrap gap-2",
              isRtl && "flex-row-reverse",
            )}
          >
            <Button
              type="button"
              className="h-9 min-h-9 px-3"
              onClick={useExistingCustomer}
            >
              {t.form.useExistingCustomer}
            </Button>
            <Link
              href={routes.customerEdit(duplicateCustomer.id)}
              className="inline-flex h-9 items-center rounded-xl border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              {t.form.editCustomerDetails}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (isWorksheet) {
    return (
      <section>
        {modeToggle}
        {draft.customerMode === "existing" ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {existingCustomerFields}
          </div>
        ) : (
          newCustomerFields
        )}
      </section>
    );
  }

  return (
    <Card>
      <CardTitle>{t.form.customer}</CardTitle>
      {modeToggle}
      {draft.customerMode === "existing" ? existingCustomerFields : newCustomerFields}
    </Card>
  );
});
