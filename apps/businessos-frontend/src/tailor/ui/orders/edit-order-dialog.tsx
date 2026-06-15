"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ImagePlus, Save, X } from "lucide-react";
import type { OrderFullDetail } from "@business-os/tailor";
import {
  emptyMeasurementsForGarment,
  emptyStyleForGarment,
  getGarmentSchema,
  mergeMeasurementsForGarmentChange,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { cn } from "@/core/presentation/lib/utils";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { findInvalidMeasurement } from "@/core/presentation/lib/validate-measurements";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import { useUpdateOrderMutation } from "@/tailor/infrastructure/api/hooks/use-orders";
import { MeasurementFieldsForm } from "@/tailor/ui/measurements/measurement-fields-form";
import { editMeasurementsPanelClass } from "@/tailor/ui/orders/worksheet-form-primitives";
import { AssignedToInput } from "./assigned-to-input";
import {
  bookingGarmentOptions,
  dressImageUploadErrorKey,
  prepareDressImageForUpload,
} from "@/tailor/infrastructure/data/new-order.mock";
import {
  resolveMediaUrl,
  uploadDressImage,
} from "@/tailor/infrastructure/api/upload.api";

interface EditOrderDialogProps {
  order: OrderFullDetail | null;
  open: boolean;
  onClose: () => void;
  assigneeSuggestions?: string[];
  assigneeWorkload?: Record<string, number>;
  focusPayment?: boolean;
}

function formatRs(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString()}`;
}

function orderToDraftFields(
  order: OrderFullDetail,
  garmentType: BookingGarmentType,
): { measurements: Record<string, string>; style: Record<string, string> } {
  const measurements = emptyMeasurementsForGarment(garmentType);
  const schema = getGarmentSchema(garmentType);

  for (const field of schema.measurementFields) {
    const value = order.measurements[field.key];
    if (value !== undefined && value !== null) {
      measurements[field.key] = String(value);
    }
  }

  const style = emptyStyleForGarment(garmentType);
  for (const field of schema.styleFields) {
    const value = order.style[field.key];
    if (value) style[field.key] = value;
  }

  return { measurements, style };
}

export function EditOrderDialog({
  order,
  open,
  onClose,
  assigneeSuggestions = [],
  assigneeWorkload,
  focusPayment = false,
}: EditOrderDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateOrder = useUpdateOrderMutation();
  const { showError, showSuccess } = useToast();

  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [suitCount, setSuitCount] = useState("1");
  const [garmentType, setGarmentType] = useState<BookingGarmentType>("shalwarQameez");
  const [fabricSource, setFabricSource] = useState<"customer" | "shop">("customer");
  const [fabricNotes, setFabricNotes] = useState("");
  const [styleNotes, setStyleNotes] = useState("");
  const [dressImageUrl, setDressImageUrl] = useState("");
  const [dressImagePublicId, setDressImagePublicId] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isRush, setIsRush] = useState(false);
  const [assignedToName, setAssignedToName] = useState("");
  const [editMeasurementsOpen, setEditMeasurementsOpen] = useState(false);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [style, setStyle] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!order || !open) return;
    const suitType = normalizeBookingGarmentType(order.garmentType);
    const draft = orderToDraftFields(order, suitType);

    setDeliveryDate(order.deliveryDate);
    setTotalPrice(String(order.totalPrice));
    setAdvancePaid(String(order.advancePaid));
    setDressCode(order.dressCode ?? "");
    setSuitCount(String(order.suitCount));
    setGarmentType(suitType);
    setFabricSource(order.fabricSource);
    setFabricNotes(order.fabricNotes ?? "");
    setStyleNotes(order.styleNotes ?? "");
    setDressImageUrl(order.dressImageUrl ?? "");
    setDressImagePublicId(order.dressImagePublicId ?? "");
    setImageError(null);
    setIsRush(order.isRush);
    setAssignedToName(order.assignedToName ?? "");
    setEditMeasurementsOpen(false);
    setMeasurements(draft.measurements);
    setStyle(draft.style);
  }, [order, open]);

  useEffect(() => {
    if (!open || !focusPayment) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById("edit-advance");
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [open, focusPayment]);

  if (!open || !order) return null;

  const orderId = order.id;
  const customerId = order.customerId;
  const garmentLabel = t.garments[garmentType];

  const balance = Math.max(
    (Number(totalPrice) || order.totalPrice) - (Number(advancePaid) || order.advancePaid),
    0,
  );

  function handleGarmentChange(next: string) {
    const nextType = normalizeBookingGarmentType(next);
    if (nextType !== garmentType) {
      setMeasurements(mergeMeasurementsForGarmentChange(nextType, measurements));
      setStyle(emptyStyleForGarment(nextType));
    }
    setGarmentType(nextType);
  }

  async function handleImageSelect(file: File | undefined) {
    if (!file) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const prepared = await prepareDressImageForUpload(file);
      const { url, publicId } = await uploadDressImage(prepared, {
        orderId,
        customerId,
      });
      setDressImageUrl(url);
      setDressImagePublicId(publicId);
    } catch (err) {
      const key = dressImageUploadErrorKey(err);
      if (key === "image_too_large") {
        setImageError(t.form.dressImageTooLarge);
      } else {
        setImageError(t.form.dressImageInvalid);
      }
    } finally {
      setImageUploading(false);
    }
  }

  function handleImageRemove() {
    setDressImageUrl("");
    setDressImagePublicId("");
    setImageError(null);
  }

  async function handleSave() {
    if (editMeasurementsOpen) {
      const invalidKey = findInvalidMeasurement(measurements);
      if (invalidKey) {
        const schema = getGarmentSchema(garmentType);
        const field = schema.measurementFields.find((f) => f.key === invalidKey);
        const label = field
          ? ((t.measurements as Record<string, string>)[field.labelKey] ?? invalidKey)
          : invalidKey;
        showError(t.errors.measurementFieldInvalid.replace("{field}", label));
        return;
      }
    }

    try {
      await updateOrder.mutateAsync({
        orderId,
        payload: {
          deliveryDate,
          totalPrice,
          advancePaid,
          dressCode,
          suitCount,
          garmentType,
          fabricSource,
          fabricNotes,
          styleNotes,
          dressImageUrl,
          dressImagePublicId,
          isRush,
          assignedToName,
          ...(editMeasurementsOpen ? { measurements, style } : {}),
        },
      });
      showSuccess(t.orderDetail.saved);
      onClose();
    } catch (err) {
      showError(resolveApiErrorMessage(err, t));
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 pb-24 sm:items-center sm:pb-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-order-title"
        className={cn(
          "flex max-h-[min(92vh,calc(100dvh-5rem))] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[90vh]",
          isRtl && "text-right",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex shrink-0 items-start justify-between gap-3 border-b border-hairline px-5 py-4",
            isRtl && "flex-row-reverse",
          )}
        >
          <div className={cn(isRtl && "text-right")}>
            <h2 id="edit-order-title" className="font-display text-lg font-bold text-foreground">
              {t.orderDetail.editOrder}
            </h2>
            <p className="mt-1 text-sm text-muted-slate">
              #{order.orderNumber} · {order.customerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-slate transition hover:bg-slate-100"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-5">
            <section className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-slate">
                {t.form.orderDetails}
              </h3>
              <AssignedToInput
                t={t}
                value={assignedToName}
                onChange={setAssignedToName}
                suggestions={assigneeSuggestions}
                assigneeWorkload={assigneeWorkload}
                isRtl={isRtl}
              />
              <div>
                <Label htmlFor="edit-garment">{t.form.garmentType}</Label>
                <SearchableCombobox
                  id="edit-garment"
                  value={garmentType}
                  onChange={handleGarmentChange}
                  options={bookingGarmentOptions.map((g) => ({
                    value: g.value,
                    label: t.garments[g.labelKey],
                  }))}
                  placeholder={t.form.selectGarment}
                  emptyMessage={t.form.noOptions}
                  isRtl={isRtl}
                  aria-label={t.form.garmentType}
                />
              </div>
              <div>
                <Label htmlFor="edit-dress-code">{t.form.dressCode}</Label>
                <Input
                  id="edit-dress-code"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                />
              </div>
              <div>
                <Label>{t.form.dressImage}</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    void handleImageSelect(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                {dressImageUrl ? (
                  <div
                    className={cn(
                      "mt-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveMediaUrl(dressImageUrl) ?? dressImageUrl}
                      alt={t.form.dressImage}
                      className="h-24 w-24 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                      <p className="text-sm font-medium text-slate-700">
                        {t.form.dressImageAttached}
                      </p>
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700"
                      >
                        <X className="h-4 w-4" />
                        {t.form.dressImageRemove}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={imageUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800 disabled:cursor-wait disabled:opacity-60",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <ImagePlus className="h-5 w-5" />
                    {imageUploading
                      ? t.form.dressImagePreparing
                      : t.form.dressImageUpload}
                  </button>
                )}
                {imageError ? (
                  <p className="mt-1 text-xs font-medium text-rose-600">{imageError}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">{t.form.dressImageHint}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="edit-suit-count">{t.form.suitCount}</Label>
                  <Input
                    id="edit-suit-count"
                    type="number"
                    min={1}
                    value={suitCount}
                    onChange={(e) => setSuitCount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-delivery">{t.form.deliveryDate}</Label>
                  <Input
                    id="edit-delivery"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </div>
              <label
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  isRtl && "flex-row-reverse justify-end",
                )}
              >
                <input
                  type="checkbox"
                  checked={isRush}
                  onChange={(e) => setIsRush(e.target.checked)}
                />
                {t.orderDetail.rushOrder}
              </label>
              <div>
                <Label htmlFor="edit-fabric-notes">{t.form.fabricNotes}</Label>
                <Textarea
                  id="edit-fabric-notes"
                  value={fabricNotes}
                  onChange={(e) => setFabricNotes(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="edit-style-notes">{t.form.styleNotes}</Label>
                <Textarea
                  id="edit-style-notes"
                  value={styleNotes}
                  onChange={(e) => setStyleNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </section>

            <section className={cn(editMeasurementsPanelClass, "mt-1")}>
              <button
                type="button"
                onClick={() => setEditMeasurementsOpen((open) => !open)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1 text-left transition hover:bg-accent-100/40",
                  isRtl && "flex-row-reverse text-right",
                )}
                aria-expanded={editMeasurementsOpen}
              >
                <span className="text-[15px] font-bold text-foreground">
                  {t.orderDetail.editMeasurements}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-accent-600 transition-transform",
                    editMeasurementsOpen && "rotate-180",
                  )}
                />
              </button>

              {editMeasurementsOpen ? (
                <div className="mt-3 space-y-3 border-t border-dashed border-accent-400/50 pt-3">
                  <p className="text-[12.5px] leading-relaxed text-accent-900/90">
                    {t.orderDetail.editMeasurementsNotice.replace("{garment}", garmentLabel)}
                  </p>
                  <p className="text-[11.5px] text-accent-800/70">
                    {t.orderDetail.editMeasurementsHint}
                  </p>
                  <MeasurementFieldsForm
                    t={t}
                    garmentType={garmentType}
                    measurements={measurements}
                    onChange={setMeasurements}
                    variant="worksheet"
                    framed={false}
                    showWorksheetHeader={false}
                  />
                </div>
              ) : null}
            </section>

            <section className="space-y-3 border-t border-hairline pt-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-slate">
                {t.orderDetail.payments}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="edit-total">{t.form.totalPrice}</Label>
                  <Input
                    id="edit-total"
                    type="number"
                    min={0}
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-advance">{t.form.advancePaid}</Label>
                  <Input
                    id="edit-advance"
                    type="number"
                    min={0}
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>
              <p className="rounded-[10px] bg-background px-3 py-2 text-sm text-muted-slate">
                {t.form.balanceDue}:{" "}
                <span className="font-semibold text-foreground">{formatRs(balance)}</span>
              </p>
            </section>
          </div>
        </div>

        <div
          className={cn(
            "flex shrink-0 gap-2 border-t border-hairline bg-white px-5 py-4",
            isRtl && "flex-row-reverse",
          )}
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={updateOrder.isPending}
          >
            {t.form.cancel}
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => void handleSave()}
            disabled={updateOrder.isPending}
          >
            <Save className="h-4 w-4" />
            {updateOrder.isPending ? t.orderDetail.saving : t.orderDetail.saveChanges}
          </Button>
        </div>
      </div>
    </div>
  );
}
