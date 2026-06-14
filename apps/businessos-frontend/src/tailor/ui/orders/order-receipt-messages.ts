import type { OrderFullDetail } from "@business-os/tailor";
import type { TenantSettings } from "@business-os/tailor";

function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.length === 10) return `92${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizePhoneForWhatsApp(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function buildOrderReceiptWhatsAppMessage(
  order: OrderFullDetail,
  shop: Pick<TenantSettings, "name" | "phone" | "address" | "whatsappFooter">,
  locale: "en" | "ur",
): string {
  const balanceLine =
    order.balanceDue > 0
      ? locale === "ur"
        ? `باقی رقم: Rs. ${order.balanceDue.toLocaleString()}`
        : `Balance due: Rs. ${order.balanceDue.toLocaleString()}`
      : locale === "ur"
        ? "ادائیگی مکمل"
        : "Paid in full";

  const addressLine = shop.address
    ? locale === "ur"
      ? `پتہ: ${shop.address}`
      : `Address: ${shop.address}`
    : "";

  const phoneLine = shop.phone
    ? locale === "ur"
      ? `فون: ${shop.phone}`
      : `Phone: ${shop.phone}`
    : "";

  const pickup =
    locale === "ur"
      ? "براہ کرم وصول کرنے کیلئے دکان پر آئیں۔"
      : "Please visit our shop to collect your order.";

  const lines =
    locale === "ur"
      ? [
          `السلام علیکم ${order.customerName}،`,
          "",
          `آپ کا آرڈر ${shop.name} میں رجسٹر ہو گیا۔`,
          "",
          `آرڈر: #${order.orderNumber}`,
          `لباس: ${order.garmentLabel} × ${order.suitCount}`,
          `کل رقم: Rs. ${order.totalPrice.toLocaleString()}`,
          `ادvance: Rs. ${order.advancePaid.toLocaleString()}`,
          balanceLine,
          `ڈیلیوری: ${order.deliveryDate}`,
          "",
          pickup,
          addressLine,
          phoneLine,
          "",
          `— ${shop.name}`,
          shop.whatsappFooter?.trim() ?? "",
        ]
      : [
          `Hello ${order.customerName},`,
          "",
          `Your order has been booked at ${shop.name}.`,
          "",
          `Order: #${order.orderNumber}`,
          `Item: ${order.garmentLabel} × ${order.suitCount}`,
          `Total: Rs. ${order.totalPrice.toLocaleString()}`,
          `Advance paid: Rs. ${order.advancePaid.toLocaleString()}`,
          balanceLine,
          `Delivery: ${order.deliveryDate}`,
          "",
          pickup,
          addressLine,
          phoneLine,
          "",
          `— ${shop.name}`,
          shop.whatsappFooter?.trim() ?? "",
        ];

  return lines.filter(Boolean).join("\n");
}
