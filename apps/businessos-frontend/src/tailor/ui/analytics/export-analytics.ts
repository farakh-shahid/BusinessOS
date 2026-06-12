import type { TailorAnalytics } from "@business-os/tailor";
import { formatRs } from "./format";

function csvEscape(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportAnalyticsCsv(data: TailorAnalytics) {
  const rows: string[][] = [
    ["BusinessOS Analytics Report"],
    ["Shop", data.shopName],
    ["Period", data.rangeLabel],
    ["Generated", new Date(data.generatedAt).toLocaleString()],
    [],
    ["Summary"],
    ["Revenue", String(Math.round(data.selectedPeriod.revenue))],
    ["Orders", String(data.selectedPeriod.orders)],
    ["Advance collected", String(Math.round(data.selectedPeriod.advanceCollected))],
    ["Outstanding balance", String(Math.round(data.outstandingBalance))],
    [],
    ["Period comparison"],
    [data.currentPeriodLabel, "Revenue", "Orders"],
    [
      data.currentPeriodLabel,
      String(Math.round(data.selectedPeriod.revenue)),
      String(data.selectedPeriod.orders),
    ],
    [
      data.comparisonPeriodLabel,
      String(Math.round(data.previousPeriod.revenue)),
      String(Math.round(data.previousPeriod.orders)),
    ],
    [],
    ["Revenue by garment"],
    ["Garment", "Orders", "Revenue (Rs.)"],
    ...data.garmentBreakdown.map((g) => [
      g.garmentLabel,
      String(g.count),
      String(Math.round(g.revenue)),
    ]),
    [],
    ["Monthly trend (last 6 months)"],
    ["Month", "Orders", "Revenue (Rs.)"],
    ...data.monthlyTrend.map((m) => [
      m.monthLabel,
      String(m.orders),
      String(Math.round(m.revenue)),
    ]),
    [],
    ["Order pipeline"],
    ["Status", "Count"],
    ["Pending", String(data.statusBreakdown.pending)],
    ["In progress", String(data.statusBreakdown.inProgress)],
    ["Ready", String(data.statusBreakdown.ready)],
    ["Delivered", String(data.statusBreakdown.delivered)],
    ["Cancelled", String(data.statusBreakdown.cancelled)],
    [],
    ["Active vs delivered (period)"],
    ["In progress (not delivered)", String(data.workflowSnapshot.inProgress)],
    ["Delivered", String(data.workflowSnapshot.delivered)],
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const slug = data.rangeLabel.replace(/[^\w]+/g, "-").toLowerCase();
  downloadBlob(
    `analytics-${slug}-${data.generatedAt.slice(0, 10)}.csv`,
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
}

export function exportAnalyticsPdf(data: TailorAnalytics, labels: Record<string, string>) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${labels.reportTitle} — ${data.shopName}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #0f172a; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .meta { color: #64748b; font-size: 13px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
    th { background: #f8fafc; }
    h2 { font-size: 15px; margin: 24px 0 8px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
    .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    .card strong { display: block; font-size: 18px; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>${labels.reportTitle}</h1>
  <p class="meta">${data.shopName} · ${data.rangeLabel} · ${new Date(data.generatedAt).toLocaleString()}</p>

  <div class="grid">
    <div class="card"><span>${labels.revenue}</span><strong>${formatRs(data.selectedPeriod.revenue)}</strong></div>
    <div class="card"><span>${labels.orders}</span><strong>${data.selectedPeriod.orders}</strong></div>
    <div class="card"><span>${labels.advance}</span><strong>${formatRs(data.selectedPeriod.advanceCollected)}</strong></div>
    <div class="card"><span>${labels.outstanding}</span><strong>${formatRs(data.outstandingBalance)}</strong></div>
  </div>

  <h2>${labels.periodComparison}</h2>
  <table>
    <thead><tr><th></th><th>${labels.revenue}</th><th>${labels.orders}</th></tr></thead>
    <tbody>
      <tr><td>${data.currentPeriodLabel}</td><td>${formatRs(data.selectedPeriod.revenue)}</td><td>${data.selectedPeriod.orders}</td></tr>
      <tr><td>${data.comparisonPeriodLabel}</td><td>${formatRs(data.previousPeriod.revenue)}</td><td>${data.previousPeriod.orders}</td></tr>
    </tbody>
  </table>

  <h2>${labels.revenueByGarment}</h2>
  <table>
    <thead><tr><th>${labels.garment}</th><th>${labels.orders}</th><th>${labels.revenue}</th></tr></thead>
    <tbody>
      ${data.garmentBreakdown
        .map(
          (g) =>
            `<tr><td>${g.garmentLabel}</td><td>${g.count}</td><td>${formatRs(g.revenue)}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <h2>${labels.monthlyTrend}</h2>
  <table>
    <thead><tr><th>${labels.month}</th><th>${labels.orders}</th><th>${labels.revenue}</th></tr></thead>
    <tbody>
      ${data.monthlyTrend
        .map(
          (m) =>
            `<tr><td>${m.monthLabel}</td><td>${m.orders}</td><td>${formatRs(m.revenue)}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <h2>${labels.activeVsDelivered}</h2>
  <table>
    <tbody>
      <tr><td>${labels.inProgress}</td><td>${data.workflowSnapshot.inProgress}</td></tr>
      <tr><td>${labels.delivered}</td><td>${data.workflowSnapshot.delivered}</td></tr>
    </tbody>
  </table>
</body>
</html>`;

  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument ?? frame.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(html);
  doc.close();

  frame.contentWindow?.focus();
  frame.contentWindow?.print();

  window.setTimeout(() => {
    document.body.removeChild(frame);
  }, 1000);
}
