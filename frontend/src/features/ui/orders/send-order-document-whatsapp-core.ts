import type { OrderDocumentType, OrderDocumentWhatsAppResult } from "@shared";
import { pdfBlobToFile } from "@/core/presentation/lib/capture-document-pdf";
import { sendOrderDocumentWhatsApp } from "@/features/infrastructure/api/order-documents.api";
import { sharePdfOnWhatsAppClient } from "./share-pdf-whatsapp";

export async function sendOrderDocumentPdfWhatsApp(params: {
  orderId: string;
  orderNumber: string;
  documentType: OrderDocumentType;
  pdfBlob: Blob;
  customerPhone: string;
  caption: string;
}): Promise<OrderDocumentWhatsAppResult> {
  const filename =
    params.documentType === "receipt"
      ? `receipt-${params.orderNumber.replace(/[^\w-]+/g, "-")}.pdf`
      : `measurements-${params.orderNumber.replace(/[^\w-]+/g, "-")}.pdf`;

  const file = pdfBlobToFile(params.pdfBlob, filename);

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
    // Fall through to client share when Baileys/API unavailable.
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
