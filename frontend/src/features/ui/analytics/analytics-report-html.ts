import type { TailorAnalytics } from "@shared";
import { formatRs, formatTrend } from "./format";
import type { AnalyticsExportLabels } from "./export-analytics";

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tableRow(cells: (string | number)[]): string {
  return `<tr>${cells.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`;
}

function tableHeader(cells: string[]): string {
  return `<thead><tr>${cells.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>`;
}

export function buildAnalyticsReportHtml(
  data: TailorAnalytics,
  labels: AnalyticsExportLabels,
): string {
  const generatedAt = new Date(data.generatedAt).toLocaleString();
  const viewLabel =
    data.viewMode === "week" ? labels.viewModeWeek : labels.viewModeMonth;
  const totalSuits = data.garmentBreakdown.reduce((sum, g) => sum + g.count, 0);

  const summaryCards = [
    { label: labels.revenue, value: formatRs(data.selectedPeriod.revenue), highlight: false },
    { label: labels.orders, value: String(data.selectedPeriod.orders), highlight: false },
    { label: labels.suits, value: String(totalSuits), highlight: false },
    { label: labels.advance, value: formatRs(data.selectedPeriod.advanceCollected), highlight: false },
    {
      label: labels.pendingAmount,
      value: formatRs(data.outstandingBalance),
      highlight: true,
    },
    { label: labels.totalCustomers, value: String(data.totalCustomers), highlight: false },
    { label: labels.avgOrderValue, value: formatRs(data.avgOrderValue), highlight: false },
    { label: labels.completionRate, value: `${data.completionRate}%`, highlight: false },
  ];

  const garmentRows = data.garmentBreakdown.length
    ? data.garmentBreakdown
        .map((g) => tableRow([g.garmentLabel, g.count, formatRs(g.revenue)]))
        .join("")
    : `<tr><td colspan="3">${escapeHtml(labels.noData)}</td></tr>`;

  const topGarmentRows = data.topGarments.length
    ? data.topGarments
        .map((g, i) => tableRow([`${i + 1}. ${g.garmentLabel}`, formatRs(g.revenue)]))
        .join("")
    : `<tr><td colspan="2">${escapeHtml(labels.noData)}</td></tr>`;

  const dailyRows = data.dailyBreakdown
    .filter((d) => !d.disabled)
    .map((d) => tableRow([d.dayLabel, d.dateLabel, d.orders, formatRs(d.revenue)]))
    .join("");

  const monthlyRows = data.monthlyTrend
    .map((m) => tableRow([m.monthLabel, m.orders, formatRs(m.revenue)]))
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(labels.reportTitle)} — ${escapeHtml(data.shopName)}</title>
  <style>
    :root {
      --ink: #0e1a36;
      --slate: #697a99;
      --hairline: #e4e8f0;
      --canvas: #f5f7fa;
      --accent: #ff6a2b;
      --accent-wash: #ffe9df;
      --booked: #3b6ff6;
      --booked-bg: #eef3fe;
    }
    * { box-sizing: border-box; }
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 16mm;
    }
    body {
      font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
      margin: 0;
      padding: 24px;
      color: var(--ink);
      font-size: 12px;
      line-height: 1.5;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      thead { display: table-header-group; }
      tfoot { display: table-footer-group; }
      tr, .section, .report-footer { page-break-inside: avoid; break-inside: avoid; }
      h2 { page-break-after: avoid; break-after: avoid; }
    }
    .print-hint {
      margin: 0 0 16px;
      padding: 10px 12px;
      border-radius: 10px;
      background: var(--canvas);
      border: 1px solid var(--hairline);
      color: var(--slate);
      font-size: 11px;
    }
    .brand {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 2px solid var(--ink);
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 6px;
      color: var(--ink);
      letter-spacing: -0.02em;
    }
    .meta { color: var(--slate); font-size: 12px; margin: 2px 0; }
    .meta strong { color: var(--ink); }
    .badge {
      display: inline-block;
      background: var(--accent-wash);
      color: var(--accent);
      border: 1px solid #ffd4c4;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    h2 {
      font-size: 13px;
      margin: 22px 0 10px;
      color: var(--ink);
      border-bottom: 1px solid var(--hairline);
      padding-bottom: 4px;
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 8px;
    }
    @media (max-width: 640px) {
      .grid { grid-template-columns: repeat(2, 1fr); }
      .two-col { grid-template-columns: 1fr !important; }
    }
    .card {
      border: 1px solid var(--hairline);
      border-radius: 10px;
      padding: 10px 12px;
      background: #fff;
    }
    .card.highlight {
      border-color: #ffd4c4;
      background: var(--accent-wash);
    }
    .card span {
      display: block;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--slate);
    }
    .card strong {
      display: block;
      font-size: 17px;
      margin-top: 4px;
      color: var(--ink);
    }
    .card.highlight strong { color: #cc5422; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 11px;
    }
    th, td {
      border: 1px solid var(--hairline);
      padding: 7px 9px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: var(--canvas);
      font-weight: 700;
      color: var(--ink);
    }
    tbody tr:nth-child(even) td { background: #fafbfd; }
    .pending-row td { background: var(--booked-bg) !important; font-weight: 600; }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .section { margin-bottom: 4px; }
    .report-footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid var(--hairline);
      text-align: center;
    }
    .report-footer .shop-line {
      color: var(--slate);
      font-size: 10px;
      margin: 0 0 8px;
    }
    .report-footer .powered-line {
      margin: 0;
      color: var(--slate);
      font-size: 11px;
      letter-spacing: 0.02em;
    }
    .report-footer .powered-line strong {
      color: var(--ink);
      font-weight: 700;
    }
  </style>
</head>
<body>
  <p class="print-hint no-print">${escapeHtml(labels.printHint)}</p>

  <div class="brand">
    <div>
      <h1>${escapeHtml(labels.reportTitle)}</h1>
      <p class="meta"><strong>${escapeHtml(data.shopName)}</strong></p>
      <p class="meta">${escapeHtml(labels.reportPeriod)}: <strong>${escapeHtml(data.rangeLabel)}</strong></p>
      ${
        data.focusLabel
          ? `<p class="meta">${escapeHtml(labels.reportFocus)}: <strong>${escapeHtml(data.focusLabel)}</strong></p>`
          : ""
      }
      <p class="meta">${escapeHtml(labels.generatedOn)}: ${escapeHtml(generatedAt)}</p>
    </div>
    <span class="badge">${escapeHtml(viewLabel)}</span>
  </div>

  <div class="section">
    <h2>${escapeHtml(labels.summary)}</h2>
    <div class="grid">
      ${summaryCards
        .map(
          (card) =>
            `<div class="card${card.highlight ? " highlight" : ""}"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong></div>`,
        )
        .join("")}
    </div>
  </div>

  <div class="section">
    <h2>${escapeHtml(labels.periodComparison)}</h2>
    <table>
      ${tableHeader(["", labels.revenue, labels.orders, labels.advance])}
      <tbody>
        ${tableRow([
          data.currentPeriodLabel,
          formatRs(data.selectedPeriod.revenue),
          data.selectedPeriod.orders,
          formatRs(data.selectedPeriod.advanceCollected),
        ])}
        ${tableRow([
          data.comparisonPeriodLabel,
          formatRs(data.previousPeriod.revenue),
          data.previousPeriod.orders,
          formatRs(data.previousPeriod.advanceCollected),
        ])}
        ${tableRow([
          labels.revenueChange,
          formatTrend(data.periodComparison.revenueChangePercent),
          "",
          "",
        ])}
        ${tableRow([
          labels.ordersChange,
          formatTrend(data.periodComparison.ordersChangePercent),
          "",
          "",
        ])}
      </tbody>
    </table>
  </div>

  <div class="section two-col">
    <div>
      <h2>${escapeHtml(labels.orderPipeline)}</h2>
      <table>
        <tbody>
          <tr class="pending-row"><td>${escapeHtml(labels.statusPending)}</td><td>${escapeHtml(data.statusBreakdown.pending)}</td></tr>
          ${tableRow([labels.statusInProgress, data.statusBreakdown.inProgress])}
          ${tableRow([labels.statusReady, data.statusBreakdown.ready])}
          ${tableRow([labels.statusDelivered, data.statusBreakdown.delivered])}
          ${tableRow([labels.statusCancelled, data.statusBreakdown.cancelled])}
        </tbody>
      </table>
    </div>
    <div>
      <h2>${escapeHtml(labels.activeVsDelivered)}</h2>
      <table>
        <tbody>
          ${tableRow([labels.inProgress, data.workflowSnapshot.inProgress])}
          ${tableRow([labels.delivered, data.workflowSnapshot.delivered])}
          ${tableRow([labels.pendingAmount, formatRs(data.outstandingBalance)])}
        </tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <h2>${escapeHtml(labels.revenueByGarment)}</h2>
    <table>
      ${tableHeader([labels.garment, labels.suitCount, labels.revenue])}
      <tbody>${garmentRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>${escapeHtml(labels.dailyBreakdown)} — ${escapeHtml(data.rangeLabel)}</h2>
    <table>
      ${tableHeader([labels.day, labels.date, labels.orders, labels.revenue])}
      <tbody>${dailyRows || `<tr><td colspan="4">${escapeHtml(labels.noData)}</td></tr>`}</tbody>
    </table>
  </div>

  <div class="section two-col">
    <div>
      <h2>${escapeHtml(labels.topGarments)}</h2>
      <table>
        ${tableHeader([labels.garment, labels.revenue])}
        <tbody>${topGarmentRows}</tbody>
      </table>
    </div>
    <div>
      <h2>${escapeHtml(labels.monthlyTrend)}</h2>
      <table>
        ${tableHeader([labels.month, labels.orders, labels.revenue])}
        <tbody>${monthlyRows}</tbody>
      </table>
    </div>
  </div>

  <footer class="report-footer">
    <p class="shop-line">${escapeHtml(data.shopName)} · ${escapeHtml(data.rangeLabel)}</p>
    <p class="powered-line">${escapeHtml(labels.poweredBy)} <strong>BusinessOS</strong></p>
  </footer>
</body>
</html>`;
}
