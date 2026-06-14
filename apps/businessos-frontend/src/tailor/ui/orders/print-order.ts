import type { OrderFullDetail } from "@business-os/tailor";
import type { TenantSettings } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { openHtmlForPrint } from "@/core/presentation/lib/open-html-for-print";
import { buildOrderReceiptHtml } from "./order-receipt-html";

export function printOrderReceipt(
  order: OrderFullDetail,
  t: Dictionary,
  shop?: Pick<TenantSettings, "name" | "phone" | "email" | "address">,
) {
  const html = buildOrderReceiptHtml({
    order,
    shop: shop ?? { name: t.appName },
    t,
  });
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
