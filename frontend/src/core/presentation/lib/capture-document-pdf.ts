import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PDF_MARGIN_MM = 10;

/** Capture the visible preview iframe — same pixels as View Receipt on screen. */
export async function iframeToPdfBlob(iframe: HTMLIFrameElement): Promise<Blob> {
  const body = await waitForIframeBody(iframe);
  return elementToPdfBlob(body);
}

/** Fallback when there is no on-screen iframe (e.g. mark ready). */
export async function htmlToPdfBlob(html: string): Promise<Blob> {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:780px;height:1200px;border:0;visibility:hidden";
  iframe.srcdoc = html;
  document.body.appendChild(iframe);

  try {
    const body = await waitForIframeBody(iframe);
    return await elementToPdfBlob(body);
  } finally {
    document.body.removeChild(iframe);
  }
}

export function pdfBlobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: "application/pdf" });
}

async function waitForIframeBody(iframe: HTMLIFrameElement): Promise<HTMLElement> {
  if (!iframe.contentDocument?.body?.innerHTML) {
    await new Promise<void>((resolve) => {
      iframe.addEventListener("load", () => resolve(), { once: true });
    });
  }

  const doc = iframe.contentDocument;
  const body = doc?.body;
  if (!doc || !body) {
    throw new Error("Document preview is not ready");
  }

  await doc.fonts.ready;
  await new Promise((resolve) => window.setTimeout(resolve, 400));
  return body;
}

async function elementToPdfBlob(element: HTMLElement): Promise<Blob> {
  const width = Math.max(element.scrollWidth, element.getBoundingClientRect().width);
  const height = Math.max(element.scrollHeight, element.getBoundingClientRect().height);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    width,
    height,
    windowWidth: width,
    windowHeight: height,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PDF_MARGIN_MM * 2;
  const contentHeight = pageHeight - PDF_MARGIN_MM * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;
  const imgData = canvas.toDataURL("image/jpeg", 0.92);

  let offsetY = PDF_MARGIN_MM;
  let remaining = imgHeight;

  pdf.addImage(imgData, "JPEG", PDF_MARGIN_MM, offsetY, contentWidth, imgHeight);
  remaining -= contentHeight;

  while (remaining > 0) {
    pdf.addPage();
    offsetY = PDF_MARGIN_MM - (imgHeight - remaining);
    pdf.addImage(imgData, "JPEG", PDF_MARGIN_MM, offsetY, contentWidth, imgHeight);
    remaining -= contentHeight;
  }

  return pdf.output("blob");
}
