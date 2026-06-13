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
import { readDressImageFile, type NewOrderDraft } from "@/tailor/infrastructure/data/new-order.mock";
import { AssignedToInput } from "./assigned-to-input";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import type { NewOrderFieldErrors } from "@/tailor/infrastructure/data/new-order-validation";

interface OrderDetailsSectionProps {
  t: Dictionary;
  draft: NewOrderDraft;
  onChange: (patch: Partial<NewOrderDraft>) => void;
  isRtl: boolean;
  assigneeSuggestions?: string[];
  fieldErrors?: NewOrderFieldErrors;
}

export function OrderDetailsSection({
  t,
  draft,
  onChange,
  isRtl,
  assigneeSuggestions = [],
  fieldErrors = {},
}: OrderDetailsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const advance = Number(draft.advancePaid) || 0;
  const total = Number(draft.totalPrice) || 0;
  const balance = Math.max(total - advance, 0);

  async function handleImageSelect(file: File | undefined) {
    if (!file) return;
    setImageError(null);
    try {
      await readDressImageFile(file);
      const { url } = await uploadDressImage(file);
      onChange({ dressImageUrl: url });
    } catch (err) {
      if (err instanceof Error && err.message === "image_too_large") {
        setImageError(t.form.dressImageTooLarge);
      } else {
        setImageError(t.form.dressImageInvalid);
      }
    }
  }

  return (
    <Card>
      <CardTitle>{t.form.orderDetails}</CardTitle>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="booking-date">{t.form.bookingDate}</Label>
          <Input
            id="booking-date"
            type="date"
            value={draft.bookingDate}
            aria-invalid={!!fieldErrors.bookingDate}
            className={
              fieldErrors.bookingDate
                ? "border-rose-300 focus-visible:ring-rose-400"
                : undefined
            }
            onChange={(e) => onChange({ bookingDate: e.target.value })}
          />
          <FormFieldError message={fieldErrors.bookingDate} />
        </div>
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
        <div className="sm:col-span-2">
          <Label htmlFor="dress-code">{t.form.dressCode}</Label>
          <Input
            id="dress-code"
            value={draft.dressCode}
            placeholder={t.form.dressCodePlaceholder}
            onChange={(e) => onChange({ dressCode: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">{t.form.dressCodeHint}</p>
        </div>
        <div className="sm:col-span-2">
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
                  onClick={() => onChange({ dressImageUrl: "" })}
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
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800",
                isRtl && "flex-row-reverse",
              )}
            >
              <ImagePlus className="h-5 w-5" />
              {t.form.dressImageUpload}
            </button>
          )}
          {imageError && (
            <p className="mt-1 text-xs font-medium text-rose-600">{imageError}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">{t.form.dressImageHint}</p>
        </div>
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
        <div className="sm:col-span-2">
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
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="fabric-notes">{t.form.fabricNotes}</Label>
          <Textarea
            id="fabric-notes"
            value={draft.fabricNotes}
            placeholder={t.form.fabricNotesPlaceholder}
            onChange={(e) => onChange({ fabricNotes: e.target.value })}
          />
        </div>
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
        <div className="sm:col-span-2 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-500">{t.form.balanceDue}</p>
          <p className="text-lg font-bold text-slate-900">
            Rs. {balance.toLocaleString()}
          </p>
        </div>
        <div className="sm:col-span-2">
          <AssignedToInput
            t={t}
            value={draft.assignedToName}
            onChange={(assignedToName) => onChange({ assignedToName })}
            suggestions={assigneeSuggestions}
            isRtl={isRtl}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={draft.isRush}
              onChange={(e) => onChange({ isRush: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300"
            />
            {t.orderDetail.rushOrder}
          </label>
        </div>
      </div>
    </Card>
  );
}
