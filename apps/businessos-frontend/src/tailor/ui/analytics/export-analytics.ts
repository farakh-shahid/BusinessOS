import type { Dictionary } from "@business-os/i18n";
import type { TailorAnalytics } from "@business-os/tailor";
import { formatRs, formatTrend } from "./format";

export interface AnalyticsExportLabels {
  reportTitle: string;
  reportPeriod: string;
  reportFocus: string;
  generatedOn: string;
  summary: string;
  revenue: string;
  orders: string;
  suits: string;
  advance: string;
  outstanding: string;
  pendingAmount: string;
  totalCustomers: string;
  avgOrderValue: string;
  completionRate: string;
  periodComparison: string;
  revenueChange: string;
  ordersChange: string;
  revenueByGarment: string;
  garment: string;
  suitCount: string;
  monthlyTrend: string;
  month: string;
  orderPipeline: string;
  statusPending: string;
  statusInProgress: string;
  statusReady: string;
  statusDelivered: string;
  statusCancelled: string;
  activeVsDelivered: string;
  inProgress: string;
  delivered: string;
  dailyBreakdown: string;
  date: string;
  day: string;
  topGarments: string;
  viewModeWeek: string;
  viewModeMonth: string;
  noData: string;
}

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

function reportSlug(data: TailorAnalytics): string {
  return data.rangeLabel.replace(/[^\w]+/g, "-").toLowerCase();
}

function buildSummaryRows(data: TailorAnalytics, labels: AnalyticsExportLabels): string[][] {
  return [
    [labels.revenue, String(Math.round(data.selectedPeriod.revenue))],
    [labels.orders, String(data.selectedPeriod.orders)],
    [labels.advance, String(Math.round(data.selectedPeriod.advanceCollected))],
    [labels.outstanding, String(Math.round(data.outstandingBalance))],
    [labels.totalCustomers, String(data.totalCustomers)],
    [labels.avgOrderValue, String(Math.round(data.avgOrderValue))],
    [`${labels.completionRate} (%)`, String(data.completionRate)],
  ];
}

export function exportAnalyticsCsv(data: TailorAnalytics, labels: AnalyticsExportLabels) {
  const rows: string[][] = [
    [labels.reportTitle],
    [labels.reportPeriod, data.rangeLabel],
    ...(data.focusLabel ? [[labels.reportFocus, data.focusLabel]] : []),
    [labels.generatedOn, new Date(data.generatedAt).toLocaleString()],
    [],
    [labels.summary],
    ...buildSummaryRows(data, labels),
    [],
    [labels.periodComparison],
    ["", labels.revenue, labels.orders, labels.advance],
    [
      data.currentPeriodLabel,
      String(Math.round(data.selectedPeriod.revenue)),
      String(data.selectedPeriod.orders),
      String(Math.round(data.selectedPeriod.advanceCollected)),
    ],
    [
      data.comparisonPeriodLabel,
      String(Math.round(data.previousPeriod.revenue)),
      String(data.previousPeriod.orders),
      String(Math.round(data.previousPeriod.advanceCollected)),
    ],
    [labels.revenueChange, formatTrend(data.periodComparison.revenueChangePercent)],
    [labels.ordersChange, formatTrend(data.periodComparison.ordersChangePercent)],
    [],
    [labels.orderPipeline],
    [labels.statusPending, String(data.statusBreakdown.pending)],
    [labels.statusInProgress, String(data.statusBreakdown.inProgress)],
    [labels.statusReady, String(data.statusBreakdown.ready)],
    [labels.statusDelivered, String(data.statusBreakdown.delivered)],
    [labels.statusCancelled, String(data.statusBreakdown.cancelled)],
    [],
    [labels.revenueByGarment],
    [labels.garment, labels.suitCount, labels.revenue],
    ...data.garmentBreakdown.map((g) => [
      g.garmentLabel,
      String(g.count),
      String(Math.round(g.revenue)),
    ]),
    [],
    [labels.topGarments],
    [labels.garment, labels.revenue],
    ...data.topGarments.map((g) => [
      g.garmentLabel,
      String(Math.round(g.revenue)),
    ]),
    [],
    [labels.dailyBreakdown],
    [labels.day, labels.date, labels.orders, labels.revenue],
    ...data.dailyBreakdown
      .filter((d) => !d.disabled)
      .map((d) => [
        d.dayLabel,
        d.dateLabel,
        String(d.orders),
        String(Math.round(d.revenue)),
      ]),
    [],
    [labels.monthlyTrend],
    [labels.month, labels.orders, labels.revenue],
    ...data.monthlyTrend.map((m) => [
      m.monthLabel,
      String(m.orders),
      String(Math.round(m.revenue)),
    ]),
    [],
    [labels.activeVsDelivered],
    [labels.inProgress, String(data.workflowSnapshot.inProgress)],
    [labels.delivered, String(data.workflowSnapshot.delivered)],
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadBlob(
    `analytics-${reportSlug(data)}-${data.generatedAt.slice(0, 10)}.csv`,
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
}

function tableRow(cells: (string | number)[]): string {
  return `<tr>${cells.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`;
}

function tableHeader(cells: string[]): string {
  return `<thead><tr>${cells.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>`;
}

export function exportAnalyticsPdf(data: TailorAnalytics, labels: AnalyticsExportLabels) {
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
        .map((g) =>
          tableRow([g.garmentLabel, g.count, formatRs(g.revenue)]),
        )
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

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(labels.reportTitle)} — ${escapeHtml(data.shopName)}</title>
  <style>
    @page { margin: 16mm; size: A4; }
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      padding: 0;
      margin: 0;
      color: #0f172a;
      font-size: 12px;
      line-height: 1.45;
    }
    .page { padding: 8px 4px 24px; }
    .brand {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 6px;
      color: #0f766e;
    }
    .meta { color: #64748b; font-size: 12px; margin: 2px 0; }
    .badge {
      display: inline-block;
      background: #f0fdfa;
      color: #0f766e;
      border: 1px solid #99f6e4;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
    h2 {
      font-size: 14px;
      margin: 22px 0 10px;
      color: #0f766e;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 8px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      background: #fff;
    }
    .card.highlight {
      border-color: #fcd34d;
      background: #fffbeb;
    }
    .card span {
      display: block;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
    }
    .card strong {
      display: block;
      font-size: 17px;
      margin-top: 4px;
      color: #0f172a;
    }
    .card.highlight strong { color: #b45309; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 7px 9px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 700;
      color: #334155;
    }
    .pending-row td { background: #fff7ed; font-weight: 600; }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8;
      font-size: 10px;
      text-align: center;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page">
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

    <h2>${escapeHtml(labels.summary)}</h2>
    <div class="grid">
      ${summaryCards
        .map(
          (card) =>
            `<div class="card${card.highlight ? " highlight" : ""}"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong></div>`,
        )
        .join("")}
    </div>

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

    <div class="two-col">
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

    <h2>${escapeHtml(labels.revenueByGarment)}</h2>
    <table>
      ${tableHeader([labels.garment, labels.suitCount, labels.revenue])}
      <tbody>${garmentRows}</tbody>
    </table>

    <h2>${escapeHtml(labels.dailyBreakdown)} — ${escapeHtml(data.rangeLabel)}</h2>
    <table>
      ${tableHeader([labels.day, labels.date, labels.orders, labels.revenue])}
      <tbody>${dailyRows || `<tr><td colspan="4">${escapeHtml(labels.noData)}</td></tr>`}</tbody>
    </table>

    <div class="two-col">
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

    <p class="footer">BusinessOS · ${escapeHtml(data.shopName)} · ${escapeHtml(data.rangeLabel)}</p>
  </div>
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

export function buildAnalyticsExportLabels(
  t: Dictionary,
  viewMode: "week" | "month",
): AnalyticsExportLabels {
  return {
    reportTitle:
      viewMode === "week"
        ? t.analytics.exportReportTitleWeek
        : t.analytics.exportReportTitleMonth,
    reportPeriod: t.analytics.reportPeriod,
    reportFocus: t.analytics.reportsFor,
    generatedOn: t.analytics.generatedOn,
    summary: t.analytics.reportSummary,
    revenue: t.analytics.revenue,
    orders: t.analytics.orders,
    suits: t.analytics.totalSuits,
    advance: t.analytics.advance,
    outstanding: t.analytics.outstanding,
    pendingAmount: t.analytics.pendingAmount,
    totalCustomers: t.analytics.totalCustomers,
    avgOrderValue: t.analytics.avgOrderValue,
    completionRate: t.analytics.completionRate,
    periodComparison: t.analytics.periodComparison,
    revenueChange: t.analytics.revenueChange,
    ordersChange: t.analytics.ordersChange,
    revenueByGarment: t.analytics.revenueByGarment,
    garment: t.analytics.garment,
    suitCount: t.analytics.suitCount,
    monthlyTrend: t.analytics.revenueTrend,
    month: t.analytics.month,
    orderPipeline: t.analytics.orderPipeline,
    statusPending: t.analytics.statusPending,
    statusInProgress: t.analytics.statusInProgress,
    statusReady: t.analytics.statusReady,
    statusDelivered: t.analytics.statusDelivered,
    statusCancelled: t.analytics.statusCancelled,
    activeVsDelivered: t.analytics.activeVsDelivered,
    inProgress: t.analytics.statusInProgress,
    delivered: t.analytics.statusDelivered,
    dailyBreakdown: t.analytics.dailyBreakdown,
    date: t.analytics.date,
    day: t.analytics.day,
    topGarments: t.analytics.topGarments,
    viewModeWeek: t.analytics.viewModeWeek,
    viewModeMonth: t.analytics.viewModeMonth,
    noData: t.analytics.noGarmentData,
  };
}
