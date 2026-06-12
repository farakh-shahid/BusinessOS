"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dictionary } from "@business-os/i18n";
import type { TailorCustomer } from "@business-os/tailor";
import { cn } from "@/core/presentation/lib/utils";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import type { NewOrderDraft } from "@/tailor/infrastructure/data/new-order.mock";
import {
  createNewCustomerSchema,
  type NewCustomerFormValues,
} from "@/tailor/ui/customers/new-customer.schema";

export interface CustomerSectionHandle {
  validateNewCustomer: () => Promise<boolean>;
}

interface CustomerSectionProps {
  t: Dictionary;
  draft: NewOrderDraft;
  customers: TailorCustomer[];
  onChange: (patch: Partial<NewOrderDraft>) => void;
  isRtl: boolean;
}

export const CustomerSection = forwardRef<
  CustomerSectionHandle,
  CustomerSectionProps
>(function CustomerSection({ t, draft, customers, onChange, isRtl }, ref) {
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

  return (
    <Card>
      <CardTitle>{t.form.customer}</CardTitle>
      <div className={cn("mt-4 flex gap-2", isRtl && "flex-row-reverse")}>
        <button
          type="button"
          onClick={() => onChange({ customerMode: "existing" })}
          className={cn(
            "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
            draft.customerMode === "existing"
              ? "border-brand-700 bg-brand-50 text-brand-800"
              : "border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          {t.form.existingCustomer}
        </button>
        <button
          type="button"
          onClick={() => onChange({ customerMode: "new" })}
          className={cn(
            "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
            draft.customerMode === "new"
              ? "border-brand-700 bg-brand-50 text-brand-800"
              : "border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          {t.form.newCustomer}
        </button>
      </div>

      {draft.customerMode === "existing" ? (
        <div className="mt-4">
          <Label htmlFor="customer-select">{t.form.selectCustomer}</Label>
          <SearchableCombobox
            id="customer-select"
            value={draft.customerId}
            onChange={(customerId) => onChange({ customerId })}
            placeholder={t.form.selectCustomer}
            searchPlaceholder={t.form.searchCustomer}
            emptyMessage={t.form.noCustomersFound}
            isRtl={isRtl}
            aria-label={t.form.selectCustomer}
            searchMinOptions={1}
            options={customers.map((c) => ({
              value: c.id,
              label: c.name,
              description: c.phone,
            }))}
          />
          {!draft.customerId && (
            <FormFieldError message={t.validation.customerRequired} />
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="customer-name">
              {t.form.name} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="customer-name"
              aria-invalid={!!errors.customerName}
              {...register("customerName")}
            />
            <FormFieldError message={errors.customerName?.message} />
          </div>
          <div>
            <Label htmlFor="customer-phone">
              {t.form.phone} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="customer-phone"
              type="tel"
              aria-invalid={!!errors.customerPhone}
              {...register("customerPhone")}
            />
            <FormFieldError message={errors.customerPhone?.message} />
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
      )}
    </Card>
  );
});
