"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, MessageCircle, Mail, X } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { routes } from "@/core/config/routes";
import {
  useMarkOrderReadyMutation,
  useOrderDetailQuery,
} from "@/tailor/infrastructure/api/hooks/use-orders";

interface MarkReadyDialogProps {
  orderId: string | null;
  onClose: () => void;
}

export function MarkReadyDialog({ orderId, onClose }: MarkReadyDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);
  const markReady = useMarkOrderReadyMutation();

  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailNotes, setEmailNotes] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setSendWhatsApp(true);
    setSendEmail(false);
    setEmailNotes("");
    setFeedback(null);
  }, [orderId]);

  if (!orderId) return null;

  const hasCustomerEmail = Boolean(order?.customerEmail?.trim());

  const handleSubmit = async () => {
    setFeedback(null);

    if (sendEmail && !hasCustomerEmail) {
      setFeedback(t.orders.emailNotFoundAddCustomer);
      return;
    }

    try {
      const result = await markReady.mutateAsync({
        orderId,
        payload: {
          sendWhatsApp,
          sendEmail,
          emailNotes: emailNotes.trim() || undefined,
        },
      });

      const messages: string[] = [t.orders.readySuccess];

      if (result.notifications.whatsapp.attempted) {
        if (result.notifications.whatsapp.sent) {
          messages.push(t.orders.whatsappSent);
        } else if (result.notifications.whatsapp.whatsappUrl) {
          window.open(result.notifications.whatsapp.whatsappUrl, "_blank");
          messages.push(t.orders.whatsappOpened);
        }
      }

      if (result.notifications.email.attempted) {
        if (result.notifications.email.sent) {
          messages.push(t.orders.emailSent);
        } else if (result.notifications.email.reason === "smtp_not_configured") {
          messages.push(t.orders.emailSkipped);
        } else if (result.notifications.email.reason === "no_customer_email") {
          messages.push(t.orders.emailNotFoundAddCustomer);
        } else if (result.notifications.email.reason === "smtp_send_failed") {
          messages.push(t.orders.emailFailed);
        }
      }

      setFeedback(messages.join(" · "));
    } catch {
      setFeedback(t.common.error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-ready-title"
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
            <h2 id="mark-ready-title" className="text-lg font-bold text-slate-900">
              {t.orders.markReadyTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t.orders.markReadySubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && (
          <p className="py-8 text-center text-sm text-slate-500">{t.common.loading}</p>
        )}

        {isError && (
          <p className="py-8 text-center text-sm text-rose-600">{t.common.error}</p>
        )}

        {order && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-slate-900">{order.customerName}</p>
              <p className="text-slate-500">
                #{order.orderNumber} · {order.garmentLabel}
              </p>
              <p className="mt-1 text-slate-500">{order.customerPhone}</p>
              {order.customerEmail ? (
                <p className="mt-1 text-slate-500">{order.customerEmail}</p>
              ) : (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    {t.orders.noEmailOnFile}. {t.orders.addEmailInCustomers}{" "}
                    <Link
                      href={routes.customers}
                      className="font-semibold underline hover:text-amber-900"
                    >
                      {t.nav.customers}
                    </Link>
                  </span>
                </p>
              )}
              {order.workflowStatus === "ready" && (
                <p className="mt-2 text-xs text-emerald-700">{t.orders.alreadyReady}</p>
              )}
            </div>

            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3",
                isRtl && "flex-row-reverse",
              )}
            >
              <input
                type="checkbox"
                checked={sendWhatsApp}
                onChange={(e) => setSendWhatsApp(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "flex items-center gap-2 font-medium text-slate-900",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  {t.orders.sendWhatsApp}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{t.orders.sendWhatsAppHint}</p>
              </div>
            </label>

            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3",
                !hasCustomerEmail && "opacity-60",
                isRtl && "flex-row-reverse",
              )}
            >
              <input
                type="checkbox"
                checked={sendEmail}
                disabled={!hasCustomerEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "flex items-center gap-2 font-medium text-slate-900",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <Mail className="h-4 w-4 text-brand-700" />
                  {t.orders.sendEmail}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {hasCustomerEmail
                    ? `${t.orders.sendEmailHint} (${order.customerEmail})`
                    : t.orders.emailNotFoundAddCustomer}
                </p>
              </div>
            </label>

            {sendEmail && hasCustomerEmail && (
              <div>
                <label
                  htmlFor="email-notes"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  {t.orders.emailNotes}
                </label>
                <textarea
                  id="email-notes"
                  value={emailNotes}
                  onChange={(e) => setEmailNotes(e.target.value)}
                  placeholder={t.orders.emailNotesPlaceholder}
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            )}

            {feedback && (
              <p
                className={cn(
                  "rounded-xl px-3 py-2 text-sm",
                  feedback.includes(t.orders.emailNotFoundAddCustomer) ||
                    feedback.includes(t.orders.emailFailed) ||
                    feedback.includes(t.orders.emailSkipped)
                    ? "bg-amber-50 text-amber-900"
                    : "bg-emerald-50 text-emerald-800",
                )}
              >
                {feedback}
              </p>
            )}

            <div className={cn("flex gap-2 pt-1", isRtl && "flex-row-reverse")}>
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={markReady.isPending}
              >
                {t.form.cancel}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={markReady.isPending}
              >
                {markReady.isPending ? t.orders.notifying : t.orders.confirmMarkReady}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
