import type { OrderDocumentWhatsAppResult } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import type { OrderDocumentType } from "@business-os/tailor";
import { sendOrderHtmlAsPdfWhatsApp } from "./send-order-document-whatsapp-core";

export function applyDocumentWhatsAppFeedback(
  result: OrderDocumentWhatsAppResult,
  t: Dictionary,
): string {
  if (result.sent) {
    return result.method === "client_share"
      ? t.receipt.whatsappPdfShared
      : t.receipt.whatsappPdfSent;
  }
  if (result.reason === "attach_pdf_locally") {
    return t.receipt.whatsappPdfDownloadAttach;
  }
  return t.receipt.whatsappPdfFailed;
}

export async function sendOrderHtmlAsPdfWhatsAppWithFeedback(params: {
  orderId: string;
  orderNumber: string;
  documentType: OrderDocumentType;
  html: string;
  customerPhone: string;
  caption: string;
  t: Dictionary;
}): Promise<string> {
  const result = await sendOrderHtmlAsPdfWhatsApp({
    orderId: params.orderId,
    orderNumber: params.orderNumber,
    documentType: params.documentType,
    html: params.html,
    customerPhone: params.customerPhone,
    caption: params.caption,
  });
  return applyDocumentWhatsAppFeedback(result, params.t);
}
