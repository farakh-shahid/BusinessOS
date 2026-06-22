"use client";

import { X } from "lucide-react";
import { getDictionary } from "@/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";

interface RevokeAccessDialogProps {
  memberName: string | null;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RevokeAccessDialog({
  memberName,
  isPending,
  onClose,
  onConfirm,
}: RevokeAccessDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  if (!memberName) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 pb-24 sm:items-center sm:pb-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="revoke-access-title"
        className={cn(
          "w-full max-w-md rounded-2xl bg-white p-5 shadow-xl",
          isRtl && "text-right",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "mb-4 flex items-start justify-between gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <div>
            <h2
              id="revoke-access-title"
              className="text-lg font-bold text-slate-900"
            >
              {t.staff.revokeAccessTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t.staff.revokeAccessMessage.replace("{name}", memberName)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isPending}
            onClick={onClose}
          >
            {t.form.cancel}
          </Button>
          <Button
            type="button"
            className="flex-1 bg-rose-600 hover:bg-rose-700"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? t.staff.revokeAccessPending : t.staff.revokeAccessConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
}
