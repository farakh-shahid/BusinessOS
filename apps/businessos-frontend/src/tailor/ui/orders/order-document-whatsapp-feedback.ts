import type { OrderDocumentWhatsAppResult } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import type { OrderDocumentType } from "@business-os/tailor";
import { sendOrderDocumentPdfWhatsApp } from "./send-order-document-whatsapp-core";

export interface WhatsAppFeedbackToastHandlers {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showToast: (message: string, type?: "error" | "success" | "info") => void;
}

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

export function showDocumentWhatsAppFeedbackToast(
  message: string,
  t: Dictionary,
  toast: WhatsAppFeedbackToastHandlers,
) {
  if (message === t.receipt.whatsappPdfFailed) {
    toast.showError(message);
    return;
  }
  if (
    message === t.receipt.whatsappPdfSent ||
    message === t.receipt.whatsappPdfShared
  ) {
    toast.showSuccess(message);
    return;
  }
  toast.showToast(message, "info");
}

export function showDocumentWhatsAppBatchFeedbackToast(
  messages: string[],
  t: Dictionary,
  toast: WhatsAppFeedbackToastHandlers,
) {
  if (messages.length === 0) return;

  const allSent = messages.every(
    (m) =>
      m === t.receipt.whatsappPdfSent || m === t.receipt.whatsappPdfShared,
  );
  if (allSent) {
    toast.showSuccess(t.receipt.whatsappPdfSent);
    return;
  }

  const failed = messages.find((m) => m === t.receipt.whatsappPdfFailed);
  if (failed) {
    toast.showError(failed);
    return;
  }

  toast.showToast(messages.join(" · "), "info");
}

export async function sendOrderDocumentPdfWhatsAppWithFeedback(params: {
  orderId: string;
  orderNumber: string;
  documentType: OrderDocumentType;
  pdfBlob: Blob;
  customerPhone: string;
  caption: string;
  t: Dictionary;
}): Promise<string> {
  const result = await sendOrderDocumentPdfWhatsApp({
    orderId: params.orderId,
    orderNumber: params.orderNumber,
    documentType: params.documentType,
    pdfBlob: params.pdfBlob,
    customerPhone: params.customerPhone,
    caption: params.caption,
  });
  return applyDocumentWhatsAppFeedback(result, params.t);
}
