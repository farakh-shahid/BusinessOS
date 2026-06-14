import type { OrderFullDetail } from "@business-os/tailor";
import type { TenantSettings } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";

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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(t.receipt.title)} — #${escapeHtml(order.orderNumber)}</title>
  <style>
    :root {
      --ink: #0e1a36;
      --slate: #697a99;
      --hairline: #e4e8f0;
      --accent: #ff6a2b;
      --ready: #12a36a;
      --urgent: #e5484d;
    }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", system-ui, sans-serif;
      color: var(--ink);
      margin: 0;
      padding: 28px;
      background: #fff;
      max-width: 720px;
      margin-inline: auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--hairline);
    }
    .shop-name { font-size: 1.35rem; font-weight: 800; margin: 0 0 4px; letter-spacing: -0.02em; }
    .shop-tag { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--slate); margin: 0; }
    .shop-meta { text-align: right; font-size: 0.82rem; color: var(--slate); line-height: 1.5; }
    .shop-meta strong { color: var(--ink); display: block; font-size: 0.9rem; }
    .receipt-label {
      margin: 18px 0 14px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 18px;
    }
    .info-block label {
      display: block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--slate);
      margin-bottom: 6px;
    }
    .info-block .name { font-size: 1rem; font-weight: 800; margin: 0 0 4px; }
    .info-block p { margin: 0; font-size: 0.88rem; color: var(--slate); }
    table.items {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 0;
      font-size: 0.88rem;
    }
    table.items th {
      text-align: left;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--slate);
      padding: 10px 8px;
      border-bottom: 2px solid var(--hairline);
    }
    table.items th.num {
      text-align: right;
    }
    table.items td {
      padding: 12px 8px;
      border-bottom: 1px solid var(--hairline);
      vertical-align: top;
    }
    table.items td.num { text-align: right; white-space: nowrap; font-weight: 600; }
    .totals {
      margin-top: 8px;
      margin-left: auto;
      width: min(100%, 280px);
      font-size: 0.9rem;
    }
    .totals div {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid var(--hairline);
    }
    .totals .advance { color: var(--ready); font-weight: 600; }
    .totals .balance {
      font-size: 1.05rem;
      font-weight: 800;
      border-bottom: none;
      padding-top: 10px;
    }
    .footer-dates {
      margin-top: 20px;
      font-size: 0.88rem;
      line-height: 1.7;
    }
    .rush {
      display: inline-block;
      margin-top: 8px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--urgent);
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-top: 36px;
    }
    .sig-line {
      border-top: 1px solid var(--ink);
      padding-top: 8px;
      font-size: 0.78rem;
      color: var(--slate);
    }
    .bottom {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid var(--hairline);
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--slate);
    }
    @media print {
      body { padding: 12px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="shop-name">${escapeHtml(shop.name)}</h1>
      <p class="shop-tag">${escapeHtml(t.appTagline)}</p>
    </div>
    <div class="shop-meta">
      ${shop.phone ? `<strong>${escapeHtml(shop.phone)}</strong>` : ""}
      ${shop.address ? `<div>${escapeHtml(shop.address)}</div>` : ""}
      <div>${escapeHtml(t.receipt.dateLabel)}: ${escapeHtml(generatedDate)}</div>
    </div>
  </div>

  <div class="receipt-label">${escapeHtml(t.receipt.title)}</div>

  <div class="info-grid">
    <div class="info-block">
      <label>${escapeHtml(t.receipt.billTo)}</label>
      <p class="name">${escapeHtml(order.customerName)}</p>
      <p>${escapeHtml(order.customerPhone)}</p>
    </div>
    <div class="info-block" style="text-align:right">
      <label>${escapeHtml(t.receipt.receiptNo)}</label>
      <p class="name">#${escapeHtml(order.orderNumber)}</p>
      ${order.dressCode ? `<p>${escapeHtml(t.form.dressCode)}: ${escapeHtml(order.dressCode)}</p>` : ""}
    </div>
  </div>

  <table class="items">
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
        <td>${escapeHtml(order.garmentLabel)}</td>
        <td>${escapeHtml(fabricLabel(order, t))}</td>
        <td class="num">${escapeHtml(order.suitCount)}</td>
        <td class="num">${escapeHtml(formatRs(rate))}</td>
        <td class="num">${escapeHtml(formatRs(lineTotal))}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div><span>${escapeHtml(t.receipt.subtotal)}</span><span>${escapeHtml(formatRs(lineTotal))}</span></div>
    <div class="advance"><span>${escapeHtml(t.receipt.advancePaid)}</span><span>- ${escapeHtml(formatRs(order.advancePaid))}</span></div>
    <div class="balance"><span>${escapeHtml(t.receipt.balanceDue)}</span><span>${escapeHtml(formatRs(order.balanceDue))}</span></div>
  </div>

  <div class="footer-dates">
    <div><strong>${escapeHtml(t.form.bookingDate)}:</strong> ${escapeHtml(order.bookingDate)}</div>
    <div><strong>${escapeHtml(t.form.deliveryDate)}:</strong> ${escapeHtml(order.deliveryDate)}</div>
    ${order.isRush ? `<div class="rush">${escapeHtml(t.receipt.rushOrder)}</div>` : ""}
  </div>

  <div class="signatures">
    <div class="sig-line">${escapeHtml(t.receipt.customerSignature)}</div>
    <div class="sig-line">${escapeHtml(t.receipt.authorizedSignature)}</div>
  </div>

  <div class="bottom">
    <span>${escapeHtml(t.receipt.thankYou)}</span>
    <span>${escapeHtml(t.receipt.generatedBy)} BusinessOS</span>
  </div>
</body>
</html>`;
}
