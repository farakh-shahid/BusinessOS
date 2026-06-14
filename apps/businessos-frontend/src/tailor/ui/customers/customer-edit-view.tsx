"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isValidPakistanPhone } from "@business-os/shared";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { cn } from "@/core/presentation/lib/utils";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { findInvalidMeasurement } from "@/core/presentation/lib/validate-measurements";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import {
  useCustomerDetailQuery,
  useSaveCustomerMeasurementMutation,
  useUpdateCustomerMutation,
} from "@/tailor/infrastructure/api/hooks/use-customers";
import {
  findSavedMeasurement,
  measurementToDraftFields,
} from "@/tailor/infrastructure/data/customer-measurement-patch";
import {
  emptyMeasurementsForGarment,
  emptyStyleForGarment,
  getGarmentSchema,
  mergeMeasurementsForGarmentChange,
  type BookingGarmentType,
} from "@business-os/tailor";
import { GarmentTypeSection } from "@/tailor/ui/orders/garment-type-section";
import { MeasurementFieldsForm } from "@/tailor/ui/measurements/measurement-fields-form";
import { StyleSpecsForm } from "@/tailor/ui/measurements/style-specs-form";
import {
  WorksheetField,
  WorksheetPanel,
  WorksheetSectionTitle,
  worksheetFieldClass,
} from "@/tailor/ui/orders/worksheet-form-primitives";
import { DialogContentSkeleton } from "@/tailor/ui/skeletons";

interface CustomerEditViewProps {
  customerId: string;
}

export function CustomerEditView({ customerId }: CustomerEditViewProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const { data, isLoading, isError } = useCustomerDetailQuery(customerId);
  const { showError, showSuccess } = useToast();
  const updateCustomer = useUpdateCustomerMutation();
  const saveMeasurement = useSaveCustomerMeasurementMutation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [garmentType, setGarmentType] =
    useState<BookingGarmentType>("shalwarQameez");
  const [measurements, setMeasurements] = useState(
    emptyMeasurementsForGarment("shalwarQameez"),
  );
  const [style, setStyle] = useState(emptyStyleForGarment("shalwarQameez"));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    setName(data.customer.name);
    setPhone(data.customer.phone);
    setEmail(data.customer.email ?? "");
    setIsVip(data.customer.isVip ?? false);
    setError(null);

    const nextGarment: BookingGarmentType = "shalwarQameez";
    setGarmentType(nextGarment);

    const m = findSavedMeasurement(data, nextGarment);
    if (m) {
      const fields = measurementToDraftFields(m, nextGarment);
      setMeasurements(fields.measurements);
      setStyle(fields.style);
    } else {
      setMeasurements(emptyMeasurementsForGarment(nextGarment));
      setStyle(emptyStyleForGarment(nextGarment));
    }
  }, [data]);

  function applyGarmentProfile(next: BookingGarmentType) {
    if (next === garmentType) return;
    setGarmentType(next);

    if (data) {
      const saved = findSavedMeasurement(data, next);
      if (saved) {
        const fields = measurementToDraftFields(saved, next);
        setMeasurements(fields.measurements);
        setStyle(fields.style);
        return;
      }
    }

    setMeasurements((prev) => mergeMeasurementsForGarmentChange(next, prev));
    setStyle(emptyStyleForGarment(next));
  }

  const isSaving = updateCustomer.isPending || saveMeasurement.isPending;

  async function handleSave() {
    if (!data) return;

    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError(t.validation.nameRequired);
      return;
    }
    if (!phone.trim()) {
      setError(t.validation.phoneRequired);
      return;
    }
    if (!isValidPakistanPhone(phone)) {
      setError(t.validation.phoneInvalid);
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.validation.emailInvalid);
      showError(t.validation.emailInvalid);
      return;
    }

    const invalidKey = findInvalidMeasurement(measurements);
    if (invalidKey) {
      const schema = getGarmentSchema(garmentType);
      const field = schema.measurementFields.find((f) => f.key === invalidKey);
      const label = field
        ? (t.measurements as Record<string, string>)[field.labelKey] ?? invalidKey
        : invalidKey;
      const msg = t.errors.measurementFieldInvalid.replace("{field}", label);
      setError(msg);
      showError(msg);
      return;
    }

    try {
      await updateCustomer.mutateAsync({
        customerId,
        payload: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          isVip,
        },
      });

      const existingForGarment = findSavedMeasurement(data, garmentType);

      await saveMeasurement.mutateAsync({
        customerId,
        measurementId: existingForGarment?.id,
        payload: {
          garmentType,
          measurements,
          style,
        },
      });

      showSuccess(t.customers.saved);
      router.push(routes.customerDetail(customerId));
    } catch (err) {
      const msg = resolveApiErrorMessage(err, t);
      setError(msg);
      showError(msg);
    }
  }

  return (
    <div className="space-y-6">
      <div className={cn(isRtl && "text-right")}>
        <Link
          href={routes.customerDetail(customerId)}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          ← {t.customers.backToProfile}
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
          {t.customers.editCustomer}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t.customers.editSubtitle}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading && <DialogContentSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      )}

      {data && (
        <>
          <WorksheetPanel className="space-y-8">
            <WorksheetSectionTitle>
              {t.customers.editCustomerWorksheetTitle}
            </WorksheetSectionTitle>

            <section className="space-y-4">
              <WorksheetSectionTitle>{t.form.customer}</WorksheetSectionTitle>
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <WorksheetField label={t.form.name} htmlFor="cust-name" required>
                    <Input
                      id="cust-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={worksheetFieldClass()}
                    />
                  </WorksheetField>
                </div>
                <WorksheetField
                  label={t.form.phone}
                  htmlFor="cust-phone"
                  required
                  hint={t.form.phoneHint}
                >
                  <Input
                    id="cust-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.form.phonePlaceholder}
                    dir="ltr"
                    className={worksheetFieldClass()}
                  />
                </WorksheetField>
                <WorksheetField label={t.form.email} htmlFor="cust-email" hint={t.form.emailHint}>
                  <Input
                    id="cust-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className={worksheetFieldClass()}
                  />
                </WorksheetField>
              </div>

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-background px-4 py-3",
                  isRtl && "flex-row-reverse text-right",
                )}
              >
                <input
                  type="checkbox"
                  checked={isVip}
                  onChange={(e) => setIsVip(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent-500 focus:ring-accent-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {t.customers.markAsVip}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-slate">
                    {t.customers.markAsVipHint}
                  </span>
                </span>
              </label>
            </section>

            <GarmentTypeSection
              t={t}
              value={garmentType}
              onChange={applyGarmentProfile}
              isRtl={isRtl}
              variant="worksheet"
            />

            <MeasurementFieldsForm
              t={t}
              garmentType={garmentType}
              measurements={measurements}
              onChange={setMeasurements}
              variant="worksheet"
            />

            <StyleSpecsForm
              t={t}
              garmentType={garmentType}
              style={style}
              onChange={setStyle}
              variant="worksheet"
            />
          </WorksheetPanel>

          <div
            className={cn(
              "flex flex-col gap-3 pb-4 sm:flex-row sm:justify-end",
              isRtl && "sm:flex-row-reverse",
            )}
          >
            <Link
              href={routes.customerDetail(customerId)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              {t.form.cancel}
            </Link>
            <Button
              className="w-full sm:w-auto"
              onClick={() => void handleSave()}
              disabled={isSaving}
            >
              {isSaving ? t.customers.saving : t.customers.saveChanges}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
