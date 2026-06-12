"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
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
import { useOrdersQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
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

interface CustomerEditDialogProps {
  customerId: string | null;
  onClose: () => void;
}

function numberToField(value?: number): string {
  return value !== undefined && value !== null ? String(value) : "";
}

function isBookingGarmentType(value?: string): value is BookingGarmentType {
  return (
    value === "shalwarQameez" ||
    value === "dressPantCoat" ||
    value === "sherwani" ||
    value === "kurta" ||
    value === "waistcoat"
  );
}

export function CustomerEditDialog({
  customerId,
  onClose,
}: CustomerEditDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const { data, isLoading, isError } = useCustomerDetailQuery(customerId);
  const { data: customerOrders = [] } = useOrdersQuery(
    customerId ? { customerId } : undefined,
  );
  const { showError, showSuccess } = useToast();
  const updateCustomer = useUpdateCustomerMutation();
  const saveMeasurement = useSaveCustomerMeasurementMutation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [garmentType, setGarmentType] =
    useState<BookingGarmentType>("shalwarQameez");
  const [measurements, setMeasurements] = useState(
    emptyMeasurementsForGarment("shalwarQameez"),
  );
  const [style, setStyle] = useState(emptyStyleForGarment("shalwarQameez"));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    setName(data.customer.name);
    setPhone(data.customer.phone);
    setEmail(data.customer.email ?? "");
    setFeedback(null);
    setError(null);

    const m = data.latestMeasurement;
    const nextGarment = isBookingGarmentType(m?.garmentType)
      ? m.garmentType
      : "shalwarQameez";
    setGarmentType(nextGarment);

    if (m) {
      const baseMeasurements = emptyMeasurementsForGarment(nextGarment);
      const schema = getGarmentSchema(nextGarment);
      for (const field of schema.measurementFields) {
        const val = m.measurements[field.key];
        if (val !== undefined && val !== null) {
          baseMeasurements[field.key] = String(val);
        }
      }
      for (const [key, val] of Object.entries(m.measurements)) {
        if (!baseMeasurements[key]?.trim() && val !== undefined) {
          baseMeasurements[key] = numberToField(val);
        }
      }
      setMeasurements(baseMeasurements);

      const baseStyle = emptyStyleForGarment(nextGarment);
      for (const field of schema.styleFields) {
        const val = m.style[field.key];
        if (val) baseStyle[field.key] = val;
      }
      setStyle(baseStyle);
    } else {
      setMeasurements(emptyMeasurementsForGarment(nextGarment));
      setStyle(emptyStyleForGarment(nextGarment));
    }
  }, [data]);

  if (!customerId) return null;

  const isSaving = updateCustomer.isPending || saveMeasurement.isPending;

  async function handleSave() {
    if (!customerId || !data) return;

    setFeedback(null);
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError(t.validation.nameRequired);
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setError(t.validation.phoneRequired);
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
        },
      });

      await saveMeasurement.mutateAsync({
        customerId,
        measurementId: data.latestMeasurement?.id,
        payload: {
          garmentType,
          measurements,
          style,
        },
      });

      setFeedback(t.customers.saved);
      showSuccess(t.customers.saved);
    } catch (err) {
      const msg = resolveApiErrorMessage(err, t);
      setError(msg);
      showError(msg);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl",
          isRtl && "text-right",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4",
            isRtl && "flex-row-reverse",
          )}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t.customers.editCustomer}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {t.customers.editSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {isLoading && (
            <p className="py-8 text-center text-sm text-slate-500">
              {t.common.loading}
            </p>
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-rose-600">
              {t.common.error}
            </p>
          )}

          {data && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {t.form.customer}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="cust-name">{t.form.name}</Label>
                    <Input
                      id="cust-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cust-phone">{t.form.phone}</Label>
                    <Input
                      id="cust-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cust-email">{t.form.email}</Label>
                    <Input
                      id="cust-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>
              </section>

              <GarmentTypeSection
                t={t}
                value={garmentType}
                onChange={(next) => {
                  if (next === garmentType) return;
                  setGarmentType(next);
                  setMeasurements((prev) =>
                    mergeMeasurementsForGarmentChange(next, prev),
                  );
                  setStyle(emptyStyleForGarment(next));
                }}
                isRtl={isRtl}
              />

              <MeasurementFieldsForm
                t={t}
                garmentType={garmentType}
                measurements={measurements}
                onChange={setMeasurements}
              />

              <StyleSpecsForm
                t={t}
                garmentType={garmentType}
                style={style}
                onChange={setStyle}
              />

              {customerOrders.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t.search.orderHistory}
                  </h3>
                  <ul className="space-y-2">
                    {customerOrders.map((order) => (
                      <li key={order.id}>
                        <Link
                          href={routes.orderDetail(order.id)}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm hover:border-brand-200"
                        >
                          <span className="font-medium text-slate-900">
                            #{order.orderNumber} · {order.items}
                          </span>
                          <span className="text-xs text-slate-500">
                            {order.dueDate}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {error && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              )}
              {feedback && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  {feedback}
                </p>
              )}
            </div>
          )}
        </div>

        {data && (
          <div
            className={cn(
              "flex shrink-0 gap-2 border-t border-slate-100 px-5 py-4",
              isRtl && "flex-row-reverse",
            )}
          >
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSaving}
            >
              {t.form.cancel}
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
              {isSaving ? t.customers.saving : t.customers.saveChanges}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
