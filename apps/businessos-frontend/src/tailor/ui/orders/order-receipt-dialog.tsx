"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, MessageCircle, Printer, X } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { measurementCardDataFromOrder } from "@business-os/tailor";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { openHtmlForPrint } from "@/core/presentation/lib/open-html-for-print";
import {
  htmlToPdfBlob,
  iframeToPdfBlob,
} from "@/core/presentation/lib/capture-document-pdf";
import { useToast } from "@/core/presentation/components/ui/toast";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { useOrderDetailQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
import { useSettingsQuery } from "@/tailor/infrastructure/api/hooks/use-settings";
import { useWhatsAppStatusQuery } from "@/tailor/infrastructure/api/hooks/use-whatsapp";
import { DialogContentSkeleton } from "@/tailor/ui/skeletons";
import { buildMeasurementCardHtml } from "./measurement-card-html";
import { buildOrderReceiptHtml } from "./order-receipt-html";
import {
  buildOrderReceiptWhatsAppMessage,
  buildOrderDocumentWhatsAppCaption,
} from "./order-receipt-messages";
import {
  sendOrderDocumentPdfWhatsAppWithFeedback,
  showDocumentWhatsAppBatchFeedbackToast,
  showDocumentWhatsAppFeedbackToast,
} from "./order-document-whatsapp-feedback";
import {
  sendWhatsAppTextWithFallback,
  whatsAppTextFeedback,
} from "./whatsapp-send";

interface OrderReceiptDialogProps {
  orderId: string | null;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  autoSendPdfs?: boolean;
}

export function OrderReceiptDialog({
  orderId,
  onClose,
  title,
  subtitle,
  autoSendPdfs = false,
}: OrderReceiptDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);
  const { data: settings } = useSettingsQuery();
  const { data: whatsappStatus } = useWhatsAppStatusQuery();
  const { showSuccess, showError, showToast } = useToast();
  const [sendingPdf, setSendingPdf] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const autoSentRef = useRef(false);

  useEffect(() => {
    if (!orderId) return;
    autoSentRef.current = false;
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

  useEffect(() => {
    if (!autoSendPdfs || autoSentRef.current || !order || !receiptHtml) return;
    if (whatsappStatus?.status !== "connected") return;

    const iframe = previewRef.current;
    if (!iframe) return;

    const runAutoSend = async () => {
      if (autoSentRef.current) return;
      autoSentRef.current = true;
      setSendingPdf(true);

      const messages: string[] = [];
      const toastHandlers = { showSuccess, showError, showToast };

      try {
        const receiptBlob = await iframeToPdfBlob(iframe);
        messages.push(
          await sendOrderDocumentPdfWhatsAppWithFeedback({
            orderId: order.id,
            orderNumber: order.orderNumber,
            documentType: "receipt",
            pdfBlob: receiptBlob,
            customerPhone: order.customerPhone,
            caption: buildOrderDocumentWhatsAppCaption(
              {
                customerName: order.customerName,
                orderNumber: order.orderNumber,
                shopName: shop.name,
                garmentLabel: order.garmentLabel,
                suitCount: order.suitCount,
                whatsappFooter: shop.whatsappFooter,
              },
              "receipt",
              locale,
            ),
            t,
          }),
        );

        const hasMeasurements = Object.values(order.measurements).some(
          (value) =>
            value !== undefined && value !== null && String(value).trim(),
        );

        if (hasMeasurements) {
          const measurementHtml = buildMeasurementCardHtml({
            data: measurementCardDataFromOrder(order),
            shop,
            t,
          });
          const measurementBlob = await htmlToPdfBlob(measurementHtml);
          messages.push(
            await sendOrderDocumentPdfWhatsAppWithFeedback({
              orderId: order.id,
              orderNumber: order.orderNumber,
              documentType: "measurements",
              pdfBlob: measurementBlob,
              customerPhone: order.customerPhone,
              caption: buildOrderDocumentWhatsAppCaption(
                {
                  customerName: order.customerName,
                  orderNumber: order.orderNumber,
                  shopName: shop.name,
                  garmentLabel: order.garmentLabel,
                  suitCount: order.suitCount,
                  whatsappFooter: shop.whatsappFooter,
                },
                "measurements",
                locale,
              ),
              t,
            }),
          );
        }

        showDocumentWhatsAppBatchFeedbackToast(messages, t, toastHandlers);
      } catch {
        showError(t.receipt.whatsappPdfFailed);
      } finally {
        setSendingPdf(false);
      }
    };

    const onReady = () => void runAutoSend();
    iframe.addEventListener("load", onReady, { once: true });
    if (iframe.contentDocument?.body?.innerHTML) {
      void runAutoSend();
    }

    return () => iframe.removeEventListener("load", onReady);
  }, [
    autoSendPdfs,
    order,
    receiptHtml,
    whatsappStatus?.status,
    shop,
    t,
    locale,
    showSuccess,
    showError,
    showToast,
  ]);

  if (!orderId) return null;

  function handlePrint() {
    if (!receiptHtml) return;
    openHtmlForPrint(receiptHtml);
  }

  async function handleWhatsAppText() {
    if (!order) return;
    const message = buildOrderReceiptWhatsAppMessage(order, shop, locale);
    const result = await sendWhatsAppTextWithFallback({
      phone: order.customerPhone,
      message,
    });
    const feedback = whatsAppTextFeedback(result, t);
    if (result.sent) showSuccess(feedback);
    else showToast(feedback, "info");
  }

  async function handleWhatsAppPdf() {
    if (!order || !receiptHtml) return;
    const iframe = previewRef.current;
    if (!iframe) return;

    setSendingPdf(true);
    try {
      const pdfBlob = await iframeToPdfBlob(iframe);
      const message = await sendOrderDocumentPdfWhatsAppWithFeedback({
        orderId: order.id,
        orderNumber: order.orderNumber,
        documentType: "receipt",
        pdfBlob,
        customerPhone: order.customerPhone,
        caption: buildOrderDocumentWhatsAppCaption(
          {
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            shopName: shop.name,
            garmentLabel: order.garmentLabel,
            suitCount: order.suitCount,
            whatsappFooter: shop.whatsappFooter,
          },
          "receipt",
          locale,
        ),
        t,
      });
      showDocumentWhatsAppFeedbackToast(message, t, {
        showSuccess,
        showError,
        showToast,
      });
    } catch {
      showError(t.receipt.whatsappPdfFailed);
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
              ref={previewRef}
              title={t.receipt.title}
              srcDoc={receiptHtml}
              className="h-[min(52vh,520px)] w-full rounded-xl border border-hairline bg-white shadow-sm"
            />
          ) : null}
        </div>

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
              onClick={() => void handleWhatsAppText()}
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
