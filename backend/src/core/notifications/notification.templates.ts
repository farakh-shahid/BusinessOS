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
        ? `باقی رقم: Rs. ${ctx.balanceDue.toLocaleString()}`
        : `Balance due: Rs. ${ctx.balanceDue.toLocaleString()}`
      : "";

  const addressPart = ctx.shopAddress?.trim()
    ? ctx.locale === "ur"
      ? `ہماری دکان کا پتہ:\n${ctx.shopAddress.trim()}`
      : `Shop address:\n${ctx.shopAddress.trim()}`
    : "";

  const footer = ctx.whatsappFooter?.trim();

  if (ctx.locale === "ur") {
    const lines = [
      `السلام علیکم، ${ctx.customerName}`,
      "",
      `خوشخبری! آپ کا ${ctx.garmentLabel} تیار ہے۔`,
      "براہ کرم وصولی کے لیے ہماری دکان پر آئیں۔",
    ];
    if (addressPart) lines.push("", addressPart);
    lines.push("", `آرڈر #${ctx.orderNumber}`);
    if (balancePart) lines.push(balancePart);
    lines.push("", "شکریہ۔", "", "نیک تمنائیں،", ctx.shopName);
    if (footer) lines.push(footer);
    return lines.join("\n");
  }

  const lines = [
    `Assalam o Alaikum, ${ctx.customerName}`,
    "",
    `Good news! Your ${ctx.garmentLabel} is ready for pickup.`,
    "You can collect it from our shop.",
  ];
  if (addressPart) lines.push("", addressPart);
  lines.push("", `Order #${ctx.orderNumber}`);
  if (balancePart) lines.push(balancePart);
  lines.push("", "Thank you.", "", "Kind regards,", ctx.shopName);
  if (footer) lines.push(footer);
  return lines.join("\n");
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
      ? `خوشخبری! آپ کا ${ctx.garmentLabel} تیار ہے۔ براہ کرم وصولی کے لیے ہماری دکان پر آئیں۔`
      : `Good news! Your ${ctx.garmentLabel} is ready for pickup. You can collect it from our shop.`;

  const addressLine = ctx.shopAddress?.trim()
    ? ctx.locale === "ur"
      ? `ہماری دکان کا پتہ:\n${ctx.shopAddress.trim()}`
      : `Shop address:\n${ctx.shopAddress.trim()}`
    : "";

  const orderLine =
    ctx.locale === "ur"
      ? `آرڈر #${ctx.orderNumber}`
      : `Order #${ctx.orderNumber}`;

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
      ? `\n\nشکریہ۔\n\nنیک تمنائیں،\n${ctx.shopName}`
      : `\n\nThank you.\n\nKind regards,\n${ctx.shopName}`;

  return [greeting, "", main, addressLine, orderLine, balanceLine, notesBlock, closing]
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

export type OrderDocumentType = "receipt" | "measurements";

export interface OrderDocumentWhatsAppContext {
  customerName: string;
  orderNumber: string;
  shopName: string;
  garmentLabel: string;
  suitCount?: number;
  locale: "en" | "ur";
  documentType: OrderDocumentType;
  documentUrl?: string;
  whatsappFooter?: string;
}

function orderGarmentPhrase(
  garmentLabel: string,
  suitCount: number,
  locale: "en" | "ur",
): string {
  const qty = suitCount > 1 ? ` (×${suitCount})` : "";
  if (locale === "ur") {
    return `آپ کا ${garmentLabel}${qty}`;
  }
  return `Your ${garmentLabel}${qty}`;
}

function receiptConfirmationLine(ctx: OrderDocumentWhatsAppContext): string {
  const suitCount = ctx.suitCount && ctx.suitCount > 0 ? ctx.suitCount : 1;
  const garment = orderGarmentPhrase(ctx.garmentLabel, suitCount, ctx.locale);

  if (ctx.locale === "ur") {
    return `${garment} موصول ہو گیا ہے اور سلائی کے لیے رجسٹر کر لیا گیا ہے۔`;
  }
  return `${garment} has been received and registered for stitching.`;
}

export function buildOrderDocumentWhatsAppCaption(
  ctx: OrderDocumentWhatsAppContext,
): string {
  const footer = ctx.whatsappFooter?.trim();

  if (ctx.documentType === "receipt") {
    if (ctx.locale === "ur") {
      const lines = [
        `السلام علیکم، ${ctx.customerName}،`,
        "",
        `${ctx.shopName} تشریف لانے اور اپنے ${ctx.garmentLabel} کے لیے ہم پر اعتماد کرنے کا شکریہ۔`,
        "",
        receiptConfirmationLine(ctx),
        "",
        `📋 آرڈر نمبر: #${ctx.orderNumber}`,
        "",
        "براہ کرم اپنی رسید منسلکہ دیکھیں۔ ہم آپ کے لیے بہترین سلائی شدہ لباس فراہم کرنے کے منتظر ہیں۔",
        "",
        "نیک تمنائیں،",
        ctx.shopName,
      ];
      if (footer) lines.push(footer);
      return lines.join("\n");
    }

    const lines = [
      `Asslam o Alaikum ${ctx.customerName},`,
      "",
      `Thank you for visiting ${ctx.shopName} and trusting us with your ${ctx.garmentLabel}.`,
      "",
      receiptConfirmationLine(ctx),
      "",
      `📋 Order Number: #${ctx.orderNumber}`,
      "",
      "Please find your receipt attached for your records. We look forward to delivering a perfectly tailored outfit for you.",
      "",
      "Warm regards,",
      ctx.shopName,
    ];
    if (footer) lines.push(footer);
    return lines.join("\n");
  }

  if (ctx.locale === "ur") {
    return `السلام علیکم ${ctx.customerName}،\n\nآپ کی پیمائش (${ctx.orderNumber}) منسلک ہے۔\n\n— ${ctx.shopName}${footer ? `\n\n${footer}` : ""}`;
  }
  return `Hello ${ctx.customerName},\n\nPlease find your measurement card for order #${ctx.orderNumber} attached.\n\n— ${ctx.shopName}${footer ? `\n\n${footer}` : ""}`;
}

export function buildOrderDocumentWhatsAppFallbackMessage(
  ctx: Omit<OrderDocumentWhatsAppContext, "documentUrl">,
): string {
  const caption = buildOrderDocumentWhatsAppCaption({
    ...ctx,
    documentUrl: "",
  });

  if (ctx.locale === "ur") {
    return `${caption}\n\n(PDF فائل منسلک کریں)`;
  }
  return `${caption}\n\n(Please attach the PDF file.)`;
}

export function orderDocumentFilename(
  documentType: OrderDocumentType,
  orderNumber: string,
): string {
  const safe = orderNumber.replace(/[^\w-]+/g, "-");
  return documentType === "receipt"
    ? `receipt-${safe}.pdf`
    : `measurements-${safe}.pdf`;
}
