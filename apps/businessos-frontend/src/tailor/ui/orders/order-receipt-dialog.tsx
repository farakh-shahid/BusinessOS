"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, MessageCircle, Printer, X } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { openHtmlForPrint } from "@/core/presentation/lib/open-html-for-print";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { useOrderDetailQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
import { useSettingsQuery } from "@/tailor/infrastructure/api/hooks/use-settings";
import { DialogContentSkeleton } from "@/tailor/ui/skeletons";
import { buildOrderReceiptHtml } from "./order-receipt-html";
import { buildOrderReceiptWhatsAppMessage, buildOrderDocumentWhatsAppCaption, buildWhatsAppUrl } from "./order-receipt-messages";
import { sendOrderHtmlAsPdfWhatsAppWithFeedback } from "./order-document-whatsapp-feedback";

interface OrderReceiptDialogProps {
  orderId: string | null;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function OrderReceiptDialog({
  orderId,
  onClose,
  title,
  subtitle,
}: OrderReceiptDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);
  const { data: settings } = useSettingsQuery();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sendingPdf, setSendingPdf] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setFeedback(null);
  }, [orderId]);

  const shop = useMemo(
    () => ({
      name: settings?.name ?? user?.tenantName ?? t.appName,
      phone: settings?.phone,
      email: settings?.email,
      address: settings?.address,
      whatsappFooter: settings?.whatsappFooter,
    }),
    [settings, user?.tenantName, t.appName],
  );

  const receiptHtml = useMemo(() => {
    if (!order) return "";
    return buildOrderReceiptHtml({ order, shop, t });
  }, [order, shop, t]);

  if (!orderId) return null;

  function handlePrint() {
    if (!receiptHtml) return;
    openHtmlForPrint(receiptHtml);
  }

  function handleWhatsAppText() {
    if (!order) return;
    const message = buildOrderReceiptWhatsAppMessage(order, shop, locale);
    const url = buildWhatsAppUrl(order.customerPhone, message);
    window.open(url, "_blank", "noopener,noreferrer");
    setFeedback(t.receipt.whatsappOpened);
  }

  async function handleWhatsAppPdf() {
    if (!order || !receiptHtml) return;
    setSendingPdf(true);
    setFeedback(null);
    try {
      const message = await sendOrderHtmlAsPdfWhatsAppWithFeedback({
        orderId: order.id,
        orderNumber: order.orderNumber,
        documentType: "receipt",
        html: receiptHtml,
        customerPhone: order.customerPhone,
        caption: buildOrderDocumentWhatsAppCaption(
          {
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            shopName: shop.name,
            whatsappFooter: shop.whatsappFooter,
          },
          "receipt",
          locale,
        ),
        t,
      });
      setFeedback(message);
    } catch {
      setFeedback(t.receipt.whatsappPdfFailed);
    } finally {
      setSendingPdf(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-4 pb-24 sm:items-center sm:pb-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-receipt-title"
        className={cn(
          "flex max-h-[min(92vh,calc(100dvh-5rem))] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl",
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
            <h2 id="order-receipt-title" className="text-lg font-bold text-slate-900">
              {title ?? t.receipt.viewReceipt}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {subtitle ?? t.receipt.viewSubtitle}
            </p>
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

        <div className="min-h-0 flex-1 overflow-hidden bg-slate-50 p-4">
          {isLoading && <DialogContentSkeleton />}
          {isError && (
            <p className="py-12 text-center text-sm text-rose-600">{t.common.error}</p>
          )}
          {order && receiptHtml ? (
            <iframe
              title={t.receipt.title}
              srcDoc={receiptHtml}
              className="h-[min(52vh,520px)] w-full rounded-xl border border-hairline bg-white shadow-sm"
            />
          ) : null}
        </div>

        {feedback ? (
          <p className="shrink-0 border-t border-emerald-100 bg-emerald-50 px-5 py-2 text-sm text-emerald-800">
            {feedback}
          </p>
        ) : null}

        {order && (
          <div
            className={cn(
              "grid shrink-0 grid-cols-2 gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:flex sm:flex-row",
              isRtl && "sm:flex-row-reverse",
            )}
          >
            <Button
              variant="outline"
              className="h-11 gap-1.5 whitespace-nowrap px-2 text-xs sm:flex-1 sm:gap-2 sm:px-3 sm:text-sm"
              onClick={handlePrint}
            >
              <Download className="h-4 w-4 shrink-0" />
              {t.receipt.downloadPdf}
            </Button>
            <Button
              variant="outline"
              className="h-11 gap-1.5 whitespace-nowrap px-2 text-xs sm:flex-1 sm:gap-2 sm:px-3 sm:text-sm"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 shrink-0" />
              {t.print.receipt}
            </Button>
            <Button
              variant="outline"
              className="h-11 gap-1.5 whitespace-nowrap px-2 text-xs sm:flex-1 sm:gap-2 sm:px-3 sm:text-sm"
              onClick={handleWhatsAppText}
              disabled={sendingPdf}
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              {t.receipt.sendWhatsAppText}
            </Button>
            <Button
              className="h-11 gap-1.5 whitespace-nowrap px-2 text-xs sm:flex-1 sm:gap-2 sm:px-3 sm:text-sm"
              onClick={() => void handleWhatsAppPdf()}
              disabled={sendingPdf}
            >
              {sendingPdf ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4 shrink-0" />
              )}
              {sendingPdf ? t.receipt.sendingPdf : t.receipt.sendWhatsAppPdf}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
