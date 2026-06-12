"use client";

import type { OrderFullDetail } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";

function formatMoney(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

function printViaIframe(html: string) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0",
  );
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDoc = frameWindow?.document;
  if (!frameWindow || !frameDoc) {
    iframe.remove();
    return;
  }

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();

  const cleanup = () => iframe.remove();
  frameWindow.addEventListener("afterprint", cleanup, { once: true });
  frameWindow.focus();
  frameWindow.print();
  window.setTimeout(cleanup, 2000);
}

/** Opens printable HTML in a new tab, or prints via iframe if popups are blocked. */
function openHtmlForPrint(html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");

  if (!win) {
    URL.revokeObjectURL(url);
    printViaIframe(html);
    return;
  }

  let printed = false;
  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    win.focus();
    win.print();
    URL.revokeObjectURL(url);
  };

  win.addEventListener("load", triggerPrint, { once: true });
  window.setTimeout(triggerPrint, 1000);
}

export function printOrderReceipt(order: OrderFullDetail, t: Dictionary) {
  const rows = [
    [t.form.customer, order.customerName],
    [t.form.phone, order.customerPhone],
    [t.form.garmentType, order.garmentLabel],
    order.dressCode ? [t.form.dressCode, order.dressCode] : null,
    [t.form.suitCount, String(order.suitCount)],
    [t.form.deliveryDate, order.deliveryDate],
    [t.form.totalPrice, formatMoney(order.totalPrice)],
    [t.form.advancePaid, formatMoney(order.advancePaid)],
    [t.form.balanceDue, formatMoney(order.balanceDue)],
  ].filter(Boolean) as [string, string][];

  const html = `<!DOCTYPE html>
<html><head><title>#${order.orderNumber}</title>
<meta charset="utf-8" />
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; }
  h1 { font-size: 1.25rem; margin: 0 0 4px; }
  .muted { color: #64748b; font-size: 0.875rem; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  td:first-child { color: #64748b; width: 40%; }
  td:last-child { font-weight: 600; text-align: right; }
  @media print { body { padding: 0; } }
</style></head><body>
  <h1>${t.orderDetail.receiptTitle}</h1>
  <p class="muted">#${order.orderNumber} · ${order.dueDate}</p>
  <table>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>
</body></html>`;

  openHtmlForPrint(html);
}

export function printMeasurementCard(order: OrderFullDetail, t: Dictionary) {
  const measurementRows = Object.entries(order.measurements)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([key, value]) => {
      const label =
        key in t.measurements
          ? t.measurements[key as keyof typeof t.measurements]
          : key;
      return `<tr><td>${label}</td><td>${value}</td></tr>`;
    });

  const styleRows = [
    order.style.chestPocket
      ? ([t.style.chestPocket, order.style.chestPocket] as const)
      : null,
    order.style.sidePockets
      ? ([t.style.sidePockets, order.style.sidePockets] as const)
      : null,
    order.style.collar ? ([t.style.collar, order.style.collar] as const) : null,
    order.style.placket
      ? ([t.style.placket, order.style.placket] as const)
      : null,
    order.style.gera ? ([t.style.gera, order.style.gera] as const) : null,
    order.style.notes
      ? ([t.form.styleNotes, order.style.notes] as const)
      : null,
  ]
    .filter((row): row is readonly [string, string] => row !== null)
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`);

  const html = `<!DOCTYPE html>
<html><head><title>${t.print.measurementCard}</title>
<meta charset="utf-8" />
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; max-width: 520px; margin: 0 auto; }
  h1 { font-size: 1.25rem; margin: 0 0 4px; }
  h2 { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 20px 0 8px; }
  .muted { color: #64748b; font-size: 0.875rem; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
  td:first-child { color: #64748b; width: 45%; }
  td:last-child { font-weight: 600; text-align: right; }
  @media print { body { padding: 0; } }
</style></head><body>
  <h1>${order.customerName}</h1>
  <p class="muted">${order.customerPhone}${order.dressCode ? ` · ${order.dressCode}` : ""}</p>
  <h2>${t.form.measurements}</h2>
  <table>${measurementRows.join("") || `<tr><td colspan="2">${t.print.noMeasurements}</td></tr>`}</table>
  <h2>${t.form.styleSpecs}</h2>
  <table>${styleRows.join("") || `<tr><td colspan="2">—</td></tr>`}</table>
</body></html>`;

  openHtmlForPrint(html);
}
