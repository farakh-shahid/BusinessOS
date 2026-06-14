"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, MessageCircle, Printer, X } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { openHtmlForPrint } from "@/core/presentation/lib/open-html-for-print";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { useSettingsQuery } from "@/tailor/infrastructure/api/hooks/use-settings";
import { buildMeasurementCardHtml } from "./measurement-card-html";
import type { MeasurementCardData } from "./measurement-card-data";
import { buildOrderDocumentWhatsAppCaption } from "./order-receipt-messages";
import { sendOrderHtmlAsPdfWhatsAppWithFeedback } from "./order-document-whatsapp-feedback";
import { htmlToPdfBlob, pdfBlobToFile } from "@/core/presentation/lib/html-to-pdf";
import { sharePdfOnWhatsAppClient } from "./share-pdf-whatsapp";

interface MeasurementCardDialogProps {
  data: MeasurementCardData | null;
  onClose: () => void;
}

export function MeasurementCardDialog({
  data,
  onClose,
}: MeasurementCardDialogProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const { data: settings } = useSettingsQuery();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sendingPdf, setSendingPdf] = useState(false);

  useEffect(() => {
    if (!data) return;
    setFeedback(null);
    setSendingPdf(false);
  }, [data]);

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

  const cardHtml = useMemo(() => {
    if (!data) return "";
    return buildMeasurementCardHtml({ data, shop, t });
  }, [data, shop, t]);

  if (!data) return null;

  const canSendWhatsApp = Boolean(data.customerPhone);

  function handlePrint() {
    if (!cardHtml) return;
    openHtmlForPrint(cardHtml);
  }

  async function handleWhatsAppPdf() {
    if (!data || !cardHtml || !data.customerPhone) return;
    setSendingPdf(true);
    setFeedback(null);
    try {
      const caption = buildOrderDocumentWhatsAppCaption(
        {
          customerName: data.customerName,
          orderNumber: data.orderNumber ?? data.garmentLabel,
          shopName: shop.name,
          whatsappFooter: shop.whatsappFooter,
        },
        "measurements",
        locale,
      );

      if (data.orderId && data.orderNumber) {
        const message = await sendOrderHtmlAsPdfWhatsAppWithFeedback({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          documentType: "measurements",
          html: cardHtml,
          customerPhone: data.customerPhone,
          caption,
          t,
        });
        setFeedback(message);
        return;
      }

      const blob = await htmlToPdfBlob(cardHtml);
      const file = pdfBlobToFile(
        blob,
        `measurements-${data.customerName.replace(/\s+/g, "-")}.pdf`,
      );
      const shared = await sharePdfOnWhatsAppClient({
        file,
        phone: data.customerPhone,
        caption,
      });
      setFeedback(
        shared === "shared"
          ? t.receipt.whatsappPdfShared
          : t.receipt.whatsappPdfDownloadAttach,
      );
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
        aria-labelledby="measurement-card-title"
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
            <h2 id="measurement-card-title" className="text-lg font-bold text-slate-900">
              {t.print.measurementCard}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t.receipt.measurementCardSubtitle}
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
          {cardHtml ? (
            <iframe
              title={t.print.measurementCard}
              srcDoc={cardHtml}
              className="h-[min(56vh,560px)] w-full rounded-xl border border-hairline bg-white shadow-sm"
            />
          ) : null}
        </div>

        {feedback ? (
          <p className="shrink-0 border-t border-emerald-100 bg-emerald-50 px-5 py-2 text-sm text-emerald-800">
            {feedback}
          </p>
        ) : null}

        <div
          className={cn(
            "flex shrink-0 flex-col gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
            <Download className="h-4 w-4" />
            {t.receipt.downloadPdf}
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            {t.print.measurements}
          </Button>
          {canSendWhatsApp ? (
            <Button
              className="flex-1 gap-2"
              onClick={() => void handleWhatsAppPdf()}
              disabled={sendingPdf}
            >
              {sendingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
              {sendingPdf ? t.receipt.sendingPdf : t.receipt.sendMeasurementsPdf}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
