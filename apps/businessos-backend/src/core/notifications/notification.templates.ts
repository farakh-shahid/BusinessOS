export interface ReadyNotificationContext {
  customerName: string;
  garmentLabel: string;
  orderNumber: string;
  shopName: string;
  locale: "en" | "ur";
  balanceDue?: number;
  shopAddress?: string;
  shopPhone?: string;
  whatsappFooter?: string;
}

export interface ReminderNotificationContext {
  customerName: string;
  garmentLabel: string;
  orderNumber: string;
  shopName: string;
  dueDate: string;
  locale: "en" | "ur";
}

export function buildReminderMessage(ctx: ReminderNotificationContext): string {
  if (ctx.locale === "ur") {
    return `السلام ${ctx.customerName}، آپ کا ${ctx.garmentLabel} آرڈر #${ctx.orderNumber} کی ڈیلیوری ${ctx.dueDate} ہے۔ براہ کرم رابطہ کریں۔ — ${ctx.shopName}`;
  }

  return `Hello ${ctx.customerName}, reminder: your ${ctx.garmentLabel} order #${ctx.orderNumber} is due ${ctx.dueDate}. Please contact us. — ${ctx.shopName}`;
}

export function buildWhatsAppMessage(ctx: ReadyNotificationContext): string {
  const balancePart =
    ctx.balanceDue && ctx.balanceDue > 0
      ? ctx.locale === "ur"
        ? `\nباقی رقم: Rs. ${ctx.balanceDue.toLocaleString()}`
        : `\nBalance due: Rs. ${ctx.balanceDue.toLocaleString()}`
      : "";

  const addressPart = ctx.shopAddress
    ? ctx.locale === "ur"
      ? `\nپتہ: ${ctx.shopAddress}`
      : `\nAddress: ${ctx.shopAddress}`
    : "";

  const phonePart = ctx.shopPhone
    ? ctx.locale === "ur"
      ? `\nفون: ${ctx.shopPhone}`
      : `\nPhone: ${ctx.shopPhone}`
    : "";

  const pickup =
    ctx.locale === "ur"
      ? "براہ کرم وصول کرنے کیلئے دکان پر آئیں۔"
      : "Please visit our shop to pick up your order.";

  const footer = ctx.whatsappFooter?.trim()
    ? `\n${ctx.whatsappFooter.trim()}`
    : "";

  if (ctx.locale === "ur") {
    return `السلام علیکم ${ctx.customerName}،\n\nآپ کا ${ctx.garmentLabel} تیار ہے۔ ${pickup}\n\nآرڈر #${ctx.orderNumber}${balancePart}${addressPart}${phonePart}\n\n— ${ctx.shopName}${footer}`;
  }

  return `Hello ${ctx.customerName},\n\nYour ${ctx.garmentLabel} is ready. ${pickup}\n\nOrder #${ctx.orderNumber}${balancePart}${addressPart}${phonePart}\n\n— ${ctx.shopName}${footer}`;
}

export function buildEmailSubject(ctx: ReadyNotificationContext): string {
  if (ctx.locale === "ur") {
    return `آپ کا ${ctx.garmentLabel} تیار ہے — ${ctx.shopName}`;
  }
  return `Your ${ctx.garmentLabel} is ready — ${ctx.shopName}`;
}

export function buildEmailBody(
  ctx: ReadyNotificationContext,
  staffNotes?: string,
): string {
  const greeting =
    ctx.locale === "ur"
      ? `السلام علیکم ${ctx.customerName}،`
      : `Hello ${ctx.customerName},`;

  const main =
    ctx.locale === "ur"
      ? `آپ کا ${ctx.garmentLabel} تیار ہے۔ براہ کرم دکان پر آ کر وصول کر لیں۔`
      : `Your ${ctx.garmentLabel} is ready. Please visit our shop to collect it.`;

  const orderLine =
    ctx.locale === "ur"
      ? `آرڈر نمبر: ${ctx.orderNumber}`
      : `Order number: ${ctx.orderNumber}`;

  const balanceLine =
    ctx.balanceDue && ctx.balanceDue > 0
      ? ctx.locale === "ur"
        ? `باقی رقم: Rs. ${ctx.balanceDue.toLocaleString()}`
        : `Balance due: Rs. ${ctx.balanceDue.toLocaleString()}`
      : "";

  const notesBlock = staffNotes?.trim()
    ? ctx.locale === "ur"
      ? `\n\nاضافی نوٹ:\n${staffNotes.trim()}`
      : `\n\nAdditional note from shop:\n${staffNotes.trim()}`
    : "";

  const closing =
    ctx.locale === "ur"
      ? `\n\nشکریہ،\n${ctx.shopName}`
      : `\n\nThank you,\n${ctx.shopName}`;

  return [greeting, "", main, orderLine, balanceLine, notesBlock, closing]
    .filter(Boolean)
    .join("\n");
}

/** Normalize Pakistani mobile to E.164 for wa.me (e.g. 03001234567 → 923001234567) */
export function normalizePhoneForWhatsApp(phone: string): string {
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
