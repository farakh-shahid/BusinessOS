"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

interface BottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isRtl?: boolean;
}

export function BottomSheet({
  open,
  title,
  onClose,
  children,
  footer,
  isRtl,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.bottomSheetOpen = "true";
    return () => {
      document.body.style.overflow = prevOverflow;
      delete document.body.dataset.bottomSheetOpen;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        className={cn(
          "relative flex max-h-[min(85dvh,640px)] w-full flex-col bg-white shadow-2xl",
          "rounded-t-3xl md:max-w-md md:rounded-2xl md:max-h-[min(88vh,640px)]",
          "animate-in slide-in-from-bottom duration-200 md:zoom-in-95 md:slide-in-from-bottom-0",
        )}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-slate-200" />
        <div
          className={cn(
            "flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <h3
            id="bottom-sheet-title"
            className={cn("text-base font-bold text-slate-900", isRtl && "text-right")}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-slate-100 px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="bottom-sheet-footer-actions">{footer}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
