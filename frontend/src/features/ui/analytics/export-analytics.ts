import type { Dictionary } from "@/i18n";
import type { TailorAnalytics } from "@shared";
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
  printHint: string;
  poweredBy: string;
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

export { exportAnalyticsPdf } from "./export-analytics-pdf";

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
    printHint: t.analytics.printHint,
    poweredBy: t.analytics.poweredBy,
  };
}
