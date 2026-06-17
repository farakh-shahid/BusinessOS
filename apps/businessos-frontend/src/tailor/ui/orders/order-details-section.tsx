"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { resolveMediaUrl, uploadDressImage } from "@/tailor/infrastructure/api/upload.api";
import {
  dressImageUploadErrorKey,
  prepareDressImageForUpload,
  type NewOrderDraft,
} from "@/tailor/infrastructure/data/new-order.mock";
import { AssignedToInput } from "./assigned-to-input";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import type { NewOrderFieldErrors } from "@/tailor/infrastructure/data/new-order-validation";
import {
  WorksheetField,
  WorksheetSectionTitle,
  worksheetFieldClass,
  worksheetTextareaClass,
} from "@/tailor/ui/orders/worksheet-form-primitives";

interface OrderDetailsSectionProps {
  t: Dictionary;
  draft: NewOrderDraft;
  onChange: (patch: Partial<NewOrderDraft>) => void;
  isRtl: boolean;
  assigneeSuggestions?: string[];
  assigneeWorkload?: Record<string, number>;
  fieldErrors?: NewOrderFieldErrors;
  variant?: "default" | "worksheet";
  /** Worksheet layout: primary = qty & dates; secondary = rest; all = full card (default). */
  fieldPlacement?: "all" | "primary" | "secondary";
}

export function OrderDetailsSection({
  t,
  draft,
  onChange,
  isRtl,
  assigneeSuggestions = [],
  assigneeWorkload,
  fieldErrors = {},
  variant = "default",
  fieldPlacement = "all",
}: OrderDetailsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const isWorksheet = variant === "worksheet";

  const advance = Number(draft.advancePaid) || 0;
  const total = Number(draft.totalPrice) || 0;
  const balance = Math.max(total - advance, 0);

  async function handleImageSelect(file: File | undefined) {
    if (!file) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const prepared = await prepareDressImageForUpload(file);
      const uploadOptions =
        draft.customerMode === "existing" && draft.customerId
          ? { customerId: draft.customerId }
          : { draftKey: draft.draftUploadKey };
      const { url, publicId } = await uploadDressImage(prepared, uploadOptions);
      onChange({ dressImageUrl: url, dressImagePublicId: publicId });
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
    onChange({ dressImageUrl: "", dressImagePublicId: "" });
  }

  const rushOrderField = (
    <div className={isWorksheet ? undefined : "sm:col-span-2"}>
      <label
        className={cn(
          "flex items-center gap-2 text-sm font-medium text-slate-700",
          isRtl && "flex-row-reverse",
        )}
      >
        <input
          type="checkbox"
          id="rush-order"
          checked={draft.isRush}
          onChange={(e) => onChange({ isRush: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300"
        />
        {t.orderDetail.rushOrder}
      </label>
    </div>
  );

  const suitCountField = isWorksheet ? (
    <WorksheetField
      label={t.form.suitCount}
      htmlFor="suit-count"
      error={fieldErrors.suitCount}
    >
      <Input
        id="suit-count"
        type="number"
        min={1}
        max={99}
        value={draft.suitCount}
        aria-invalid={!!fieldErrors.suitCount}
        className={worksheetFieldClass(!!fieldErrors.suitCount)}
        onChange={(e) => onChange({ suitCount: e.target.value })}
      />
    </WorksheetField>
  ) : (
    <div>
      <Label htmlFor="suit-count">{t.form.suitCount}</Label>
      <Input
        id="suit-count"
        type="number"
        min={1}
        max={99}
        value={draft.suitCount}
        aria-invalid={!!fieldErrors.suitCount}
        className={
          fieldErrors.suitCount
            ? "border-rose-300 focus-visible:ring-rose-400"
            : undefined
        }
        onChange={(e) => onChange({ suitCount: e.target.value })}
      />
      <FormFieldError message={fieldErrors.suitCount} />
    </div>
  );

  const bookingDateDisabledClass =
    "bg-slate-50 text-slate-600 cursor-not-allowed";

  const bookingDateField = isWorksheet ? (
    <WorksheetField
      label={t.form.bookingDate}
      htmlFor="booking-date"
      error={fieldErrors.bookingDate}
    >
      <Input
        id="booking-date"
        type="date"
        value={draft.bookingDate}
        readOnly
        disabled
        aria-invalid={!!fieldErrors.bookingDate}
        className={cn(
          worksheetFieldClass(!!fieldErrors.bookingDate),
          bookingDateDisabledClass,
        )}
      />
    </WorksheetField>
  ) : (
    <div>
      <Label htmlFor="booking-date">{t.form.bookingDate}</Label>
      <Input
        id="booking-date"
        type="date"
        value={draft.bookingDate}
        readOnly
        disabled
        aria-invalid={!!fieldErrors.bookingDate}
        className={cn(
          fieldErrors.bookingDate
            ? "border-rose-300 focus-visible:ring-rose-400"
            : undefined,
          bookingDateDisabledClass,
        )}
      />
      <FormFieldError message={fieldErrors.bookingDate} />
    </div>
  );

  const deliveryDateField = isWorksheet ? (
    <WorksheetField
      label={t.form.deliveryDate}
      htmlFor="delivery"
      error={fieldErrors.deliveryDate}
    >
      <Input
        id="delivery"
        type="date"
        value={draft.deliveryDate}
        aria-invalid={!!fieldErrors.deliveryDate}
        className={worksheetFieldClass(!!fieldErrors.deliveryDate)}
        onChange={(e) => onChange({ deliveryDate: e.target.value })}
      />
    </WorksheetField>
  ) : (
    <div>
      <Label htmlFor="delivery">{t.form.deliveryDate}</Label>
      <Input
        id="delivery"
        type="date"
        value={draft.deliveryDate}
        aria-invalid={!!fieldErrors.deliveryDate}
        className={
          fieldErrors.deliveryDate
            ? "border-rose-300 focus-visible:ring-rose-400"
            : undefined
        }
        onChange={(e) => onChange({ deliveryDate: e.target.value })}
      />
      <FormFieldError message={fieldErrors.deliveryDate} />
    </div>
  );

  const totalPriceField = isWorksheet ? (
    <WorksheetField
      label={t.form.totalPrice}
      htmlFor="total"
      error={fieldErrors.totalPrice}
    >
      <Input
        id="total"
        type="number"
        min={0}
        value={draft.totalPrice}
        aria-invalid={!!fieldErrors.totalPrice}
        className={worksheetFieldClass(!!fieldErrors.totalPrice)}
        onChange={(e) => onChange({ totalPrice: e.target.value })}
      />
    </WorksheetField>
  ) : (
    <div>
      <Label htmlFor="total">{t.form.totalPrice}</Label>
      <Input
        id="total"
        type="number"
        min={0}
        value={draft.totalPrice}
        aria-invalid={!!fieldErrors.totalPrice}
        className={
          fieldErrors.totalPrice
            ? "border-rose-300 focus-visible:ring-rose-400"
            : undefined
        }
        onChange={(e) => onChange({ totalPrice: e.target.value })}
      />
      <FormFieldError message={fieldErrors.totalPrice} />
    </div>
  );

  const advancePaidField = isWorksheet ? (
    <WorksheetField label={t.form.advancePaid} htmlFor="advance">
      <Input
        id="advance"
        type="number"
        min={0}
        value={draft.advancePaid}
        className={worksheetFieldClass()}
        onChange={(e) => onChange({ advancePaid: e.target.value })}
      />
    </WorksheetField>
  ) : (
    <div>
      <Label htmlFor="advance">{t.form.advancePaid}</Label>
      <Input
        id="advance"
        type="number"
        min={0}
        value={draft.advancePaid}
        onChange={(e) => onChange({ advancePaid: e.target.value })}
      />
    </div>
  );

  const balanceDueBlock = (
    <div className="sm:col-span-2 rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-sm text-slate-500">{t.form.balanceDue}</p>
      <p className="text-lg font-bold text-slate-900">
        Rs. {balance.toLocaleString()}
      </p>
    </div>
  );

  if (isWorksheet && fieldPlacement === "primary") {
    return (
      <>
        {rushOrderField}
        {suitCountField}
        {bookingDateField}
        {deliveryDateField}
        {totalPriceField}
        {advancePaidField}
        {balanceDueBlock}
      </>
    );
  }

  const secondaryFields = (
    <>
      {!isWorksheet ? bookingDateField : null}
      {!isWorksheet ? rushOrderField : null}
      {!isWorksheet ? suitCountField : null}
      <div className={isWorksheet ? undefined : "sm:col-span-2"}>
        {isWorksheet ? (
          <WorksheetField
            label={t.form.dressCode}
            htmlFor="dress-code"
            hint={t.form.dressCodeHint}
          >
            <Input
              id="dress-code"
              value={draft.dressCode}
              placeholder={t.form.dressCodePlaceholder}
              className={worksheetFieldClass()}
              onChange={(e) => onChange({ dressCode: e.target.value })}
            />
          </WorksheetField>
        ) : (
          <>
            <Label htmlFor="dress-code">{t.form.dressCode}</Label>
            <Input
              id="dress-code"
              value={draft.dressCode}
              placeholder={t.form.dressCodePlaceholder}
              onChange={(e) => onChange({ dressCode: e.target.value })}
            />
            <p className="mt-1 text-xs text-slate-500">{t.form.dressCodeHint}</p>
          </>
        )}
      </div>
      <div className={isWorksheet ? "sm:col-span-2" : "sm:col-span-2"}>
        {isWorksheet ? (
          <WorksheetField label={t.form.dressImage}>
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
            {draft.dressImageUrl ? (
              <div
                className={cn(
                  "mt-1 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3",
                  isRtl && "flex-row-reverse",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(draft.dressImageUrl) ?? draft.dressImageUrl}
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
                  "mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800 disabled:cursor-wait disabled:opacity-60",
                  isRtl && "flex-row-reverse",
                )}
              >
                <ImagePlus className="h-5 w-5" />
                {imageUploading ? t.form.dressImagePreparing : t.form.dressImageUpload}
              </button>
            )}
            {imageError ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{imageError}</p>
            ) : null}
          </WorksheetField>
        ) : (
          <>
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
            {draft.dressImageUrl ? (
              <div
                className={cn(
                  "mt-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3",
                  isRtl && "flex-row-reverse",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(draft.dressImageUrl) ?? draft.dressImageUrl}
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
                {imageUploading ? t.form.dressImagePreparing : t.form.dressImageUpload}
              </button>
            )}
            {imageError && (
              <p className="mt-1 text-xs font-medium text-rose-600">{imageError}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">{t.form.dressImageHint}</p>
          </>
        )}
      </div>
      {!isWorksheet ? deliveryDateField : null}
      <div className={isWorksheet ? "sm:col-span-2" : "sm:col-span-2"}>
        {isWorksheet ? (
          <WorksheetField label={t.form.fabricSource}>
            <div
              className={cn(
                "mt-1 flex gap-2",
                isRtl && "flex-row-reverse",
              )}
            >
              <button
                type="button"
                onClick={() => onChange({ fabricSource: "customer" })}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-medium",
                  draft.fabricSource === "customer"
                    ? "border-brand-700 bg-brand-50 text-brand-800"
                    : "border-slate-200 text-slate-600",
                )}
              >
                {t.form.fabricCustomer}
              </button>
              <button
                type="button"
                onClick={() => onChange({ fabricSource: "shop" })}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-medium",
                  draft.fabricSource === "shop"
                    ? "border-brand-700 bg-brand-50 text-brand-800"
                    : "border-slate-200 text-slate-600",
                )}
              >
                {t.form.fabricShop}
              </button>
            </div>
          </WorksheetField>
        ) : (
          <>
            <Label>{t.form.fabricSource}</Label>
            <div
              className={cn(
                "mt-1.5 flex gap-2",
                isRtl && "flex-row-reverse",
              )}
            >
              <button
                type="button"
                onClick={() => onChange({ fabricSource: "customer" })}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-medium",
                  draft.fabricSource === "customer"
                    ? "border-brand-700 bg-brand-50 text-brand-800"
                    : "border-slate-200 text-slate-600",
                )}
              >
                {t.form.fabricCustomer}
              </button>
              <button
                type="button"
                onClick={() => onChange({ fabricSource: "shop" })}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-medium",
                  draft.fabricSource === "shop"
                    ? "border-brand-700 bg-brand-50 text-brand-800"
                    : "border-slate-200 text-slate-600",
                )}
              >
                {t.form.fabricShop}
              </button>
            </div>
          </>
        )}
      </div>
      <div className={isWorksheet ? "sm:col-span-2" : "sm:col-span-2"}>
        {isWorksheet ? (
          <WorksheetField label={t.form.fabricNotes} htmlFor="fabric-notes">
            <Textarea
              id="fabric-notes"
              value={draft.fabricNotes}
              placeholder={t.form.fabricNotesPlaceholder}
              className={worksheetTextareaClass}
              onChange={(e) => onChange({ fabricNotes: e.target.value })}
            />
          </WorksheetField>
        ) : (
          <>
            <Label htmlFor="fabric-notes">{t.form.fabricNotes}</Label>
            <Textarea
              id="fabric-notes"
              value={draft.fabricNotes}
              placeholder={t.form.fabricNotesPlaceholder}
              onChange={(e) => onChange({ fabricNotes: e.target.value })}
            />
          </>
        )}
      </div>
      {!isWorksheet ? (
        <>
          {totalPriceField}
          {advancePaidField}
          {balanceDueBlock}
        </>
      ) : null}
      <div className="sm:col-span-2">
        <AssignedToInput
          t={t}
          value={draft.assignedToName}
          onChange={(assignedToName) => onChange({ assignedToName })}
          suggestions={assigneeSuggestions}
          assigneeWorkload={assigneeWorkload}
          isRtl={isRtl}
        />
      </div>
    </>
  );

  if (isWorksheet && fieldPlacement === "secondary") {
    return (
      <section className="space-y-4">
        <WorksheetSectionTitle>{t.form.orderDetails}</WorksheetSectionTitle>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {secondaryFields}
        </div>
      </section>
    );
  }

  return (
    <Card>
      <CardTitle>{t.form.orderDetails}</CardTitle>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {secondaryFields}
      </div>
    </Card>
  );
}
