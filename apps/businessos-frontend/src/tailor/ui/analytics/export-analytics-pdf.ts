import type { TailorAnalytics } from "@business-os/tailor";
import { openHtmlForPrint } from "@/core/presentation/lib/open-html-for-print";
import { buildAnalyticsReportHtml } from "./analytics-report-html";
import type { AnalyticsExportLabels } from "./export-analytics";

/** Opens the analytics report in the browser print dialog (Save as PDF). */
export function exportAnalyticsPdf(
  data: TailorAnalytics,
  labels: AnalyticsExportLabels,
): void {
  const html = buildAnalyticsReportHtml(data, labels);
  openHtmlForPrint(html);
}
