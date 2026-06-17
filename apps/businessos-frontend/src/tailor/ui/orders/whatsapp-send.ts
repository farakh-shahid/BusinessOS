import type { Dictionary } from "@business-os/i18n";
import { sendWhatsAppMessage } from "@/tailor/infrastructure/api/whatsapp.api";
import { buildWhatsAppUrl } from "./order-receipt-messages";

export async function sendWhatsAppTextWithFallback(params: {
  phone: string;
  message: string;
}): Promise<{ sent: boolean; method?: string }> {
  try {
    const result = await sendWhatsAppMessage(params.phone, params.message);
    if (result.sent) {
      return { sent: true, method: result.method };
    }
    const url = result.whatsappUrl ?? buildWhatsAppUrl(params.phone, params.message);
    window.open(url, "_blank", "noopener,noreferrer");
    return { sent: false, method: result.method ?? "wa_me_link" };
  } catch {
    window.open(
      buildWhatsAppUrl(params.phone, params.message),
      "_blank",
      "noopener,noreferrer",
    );
    return { sent: false, method: "wa_me_link" };
  }
}

export function whatsAppTextFeedback(
  result: { sent: boolean },
  t: Dictionary,
): string {
  return result.sent ? t.receipt.whatsappSent : t.receipt.whatsappOpened;
}
