import type { TailorAnalytics } from "@business-os/tailor";
import { buildAnalyticsReportHtml } from "./analytics-report-html";
import type { AnalyticsExportLabels } from "./export-analytics";

function reportSlug(data: TailorAnalytics): string {
  return data.rangeLabel.replace(/[^\w]+/g, "-").toLowerCase();
}

function pdfFilename(data: TailorAnalytics): string {
  return `analytics-${reportSlug(data)}-${data.generatedAt.slice(0, 10)}.pdf`;
}

function mountReportElement(html: string): HTMLDivElement {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "794px";
  host.style.background = "#fff";
  host.style.pointerEvents = "none";
  host.style.zIndex = "-1";

  const iframe = document.createElement("iframe");
  iframe.style.width = "794px";
  iframe.style.height = "1123px";
  iframe.style.border = "0";
  host.appendChild(iframe);
  document.body.appendChild(host);

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(host);
    throw new Error("Could not render analytics report");
  }

  doc.open();
  doc.write(html);
  doc.close();

  const page = doc.body;
  page.style.margin = "0";
  return host;
}

export async function buildAnalyticsPdf(
  data: TailorAnalytics,
  labels: AnalyticsExportLabels,
): Promise<Blob> {
  const html = buildAnalyticsReportHtml(data, labels);
  const host = mountReportElement(html);
  const iframe = host.querySelector("iframe");

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const source = iframe?.contentDocument?.body;
    if (!source) {
      throw new Error("Could not render analytics report");
    }

    return html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: pdfFilename(data),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(source)
      .outputPdf("blob");
  } finally {
    document.body.removeChild(host);
  }
}

export async function exportAnalyticsPdf(
  data: TailorAnalytics,
  labels: AnalyticsExportLabels,
): Promise<void> {
  const blob = await buildAnalyticsPdf(data, labels);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = pdfFilename(data);
  link.click();
  URL.revokeObjectURL(url);
}
