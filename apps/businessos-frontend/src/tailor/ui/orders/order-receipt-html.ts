import type { OrderFullDetail } from "@business-os/tailor";
import type { TenantSettings } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import {
  DOCUMENT_PRINT_BASE_CSS,
  DOCUMENT_PRINT_FONTS,
} from "./document-print-styles";

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatRs(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

function fabricLabel(order: OrderFullDetail, t: Dictionary): string {
  if (order.fabricNotes?.trim()) return order.fabricNotes.trim();
  return order.fabricSource === "shop"
    ? t.form.fabricShop
    : t.form.fabricCustomer;
}

export interface OrderReceiptHtmlInput {
  order: OrderFullDetail;
  shop: Pick<TenantSettings, "name" | "phone" | "email" | "address">;
  t: Dictionary;
  generatedDate?: string;
}

export function buildOrderReceiptHtml({
  order,
  shop,
  t,
  generatedDate = new Date().toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
}: OrderReceiptHtmlInput): string {
  const lineTotal = order.totalPrice;
  const rate = order.suitCount > 0 ? lineTotal / order.suitCount : lineTotal;
  const tagline = (shop.address ?? t.appTagline).toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(t.receipt.title)} — #${escapeHtml(order.orderNumber)}</title>
  ${DOCUMENT_PRINT_FONTS}
  <style>${DOCUMENT_PRINT_BASE_CSS}</style>
</head>
<body>
  <div class="dhead">
    <div class="dbrand">
      ${escapeHtml(shop.name)}
      <small>${escapeHtml(tagline)}</small>
    </div>
    <div class="dright">
      ${shop.phone ? `📞 ${escapeHtml(shop.phone)}<br>` : ""}
      ${shop.address ? `${escapeHtml(shop.address)}<br>` : ""}
      ${escapeHtml(t.receipt.dateLabel)}: ${escapeHtml(generatedDate)}
    </div>
  </div>

  <div class="dtitle">${escapeHtml(t.receipt.title)}</div>

  <div class="meta-row">
    <div class="meta-block">
      <div class="k">${escapeHtml(t.receipt.billTo)}</div>
      <div class="v">${escapeHtml(order.customerName)}</div>
      <div class="s">${escapeHtml(order.customerPhone)}</div>
    </div>
    <div class="meta-block right">
      <div class="k">${escapeHtml(t.receipt.receiptNo)}</div>
      <div class="v">#${escapeHtml(order.orderNumber)}</div>
      ${order.dressCode ? `<div class="s">${escapeHtml(t.receipt.measurementCardSuitNo)}: ${escapeHtml(order.dressCode)}</div>` : ""}
    </div>
  </div>

  <table class="doc-table">
    <thead>
      <tr>
        <th>${escapeHtml(t.receipt.garment)}</th>
        <th>${escapeHtml(t.receipt.fabric)}</th>
        <th class="num">${escapeHtml(t.receipt.qty)}</th>
        <th class="num">${escapeHtml(t.receipt.rate)}</th>
        <th class="num">${escapeHtml(t.receipt.amount)}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>${escapeHtml(order.garmentLabel)}</b></td>
        <td>${escapeHtml(fabricLabel(order, t))}</td>
        <td class="num">${escapeHtml(order.suitCount)}</td>
        <td class="num">${escapeHtml(formatRs(rate))}</td>
        <td class="num">${escapeHtml(formatRs(lineTotal))}</td>
      </tr>
    </tbody>
  </table>

  <div style="max-width:280px;margin-left:auto">
    <div class="drow">
      <span class="dk">${escapeHtml(t.receipt.subtotal)}</span>
      <span>${escapeHtml(formatRs(lineTotal))}</span>
    </div>
    <div class="drow">
      <span class="dk">${escapeHtml(t.receipt.advancePaid)}</span>
      <span style="color:var(--ready)">− ${escapeHtml(formatRs(order.advancePaid))}</span>
    </div>
    <div class="totbox">
      <div class="tot">
        <span>${escapeHtml(t.receipt.balanceDue)}</span>
        <span>${escapeHtml(formatRs(order.balanceDue))}</span>
      </div>
    </div>
  </div>

  <div class="dates-line">
    <b>${escapeHtml(t.form.bookingDate)}:</b> ${escapeHtml(order.bookingDate)}
    &nbsp;&nbsp;
    <b>${escapeHtml(t.form.deliveryDate)}:</b> ${escapeHtml(order.deliveryDate)}
    ${order.isRush ? `<span class="rush">${escapeHtml(t.receipt.rushOrder)}</span>` : ""}
  </div>

  <div class="dfoot">
    <span>${escapeHtml(t.receipt.thankYou)}</span>
    <span>${escapeHtml(t.receipt.generatedBy)} BusinessOS</span>
  </div>
</body>
</html>`;
}
