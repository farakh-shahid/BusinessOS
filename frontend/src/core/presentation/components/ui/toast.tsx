"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

type ToastType = "error" | "success" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => dismiss(id), 6000);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      showToast,
      showError: (message: string) => showToast(message, "error"),
      showSuccess: (message: string) => showToast(message, "success"),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg",
              toast.type === "error" &&
                "border-rose-200 bg-rose-50 text-rose-900",
              toast.type === "success" &&
                "border-emerald-200 bg-emerald-50 text-emerald-900",
              toast.type === "info" &&
                "border-slate-200 bg-white text-slate-800",
            )}
          >
            {toast.type === "error" ? (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            ) : toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : null}
            <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
