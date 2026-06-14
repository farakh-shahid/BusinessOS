import type { OrderDocumentType, OrderDocumentWhatsAppResult } from "@business-os/tailor";
import {
  htmlToPdfBlob,
  pdfBlobToFile,
} from "@/core/presentation/lib/html-to-pdf";
import { sendOrderDocumentWhatsApp } from "@/tailor/infrastructure/api/order-documents.api";
import { sharePdfOnWhatsAppClient } from "./share-pdf-whatsapp";

export async function sendOrderHtmlAsPdfWhatsApp(params: {
  orderId: string;
  orderNumber: string;
  documentType: OrderDocumentType;
  html: string;
  customerPhone: string;
  caption: string;
}): Promise<OrderDocumentWhatsAppResult> {
  const blob = await htmlToPdfBlob(params.html);
  const filename =
    params.documentType === "receipt"
      ? `receipt-${params.orderNumber.replace(/[^\w-]+/g, "-")}.pdf`
      : `measurements-${params.orderNumber.replace(/[^\w-]+/g, "-")}.pdf`;

  const file = pdfBlobToFile(blob, filename);

  try {
    const result = await sendOrderDocumentWhatsApp(
      params.orderId,
      params.documentType,
      file,
    );
    if (result.sent) {
      return result;
    }
  } catch {
    // Fall through to direct client share (no Cloudinary, no broken links).
  }

  const shared = await sharePdfOnWhatsAppClient({
    file,
    phone: params.customerPhone,
    caption: params.caption,
  });

  return {
    sent: shared === "shared",
    method: shared === "shared" ? "client_share" : "wa_me_link",
    reason: shared === "shared" ? undefined : "attach_pdf_locally",
  };
}
