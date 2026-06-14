import { buildWhatsAppUrl } from "./order-receipt-messages";

export type ClientPdfShareResult = "shared" | "opened";

export async function sharePdfOnWhatsAppClient(params: {
  file: File;
  phone: string;
  caption: string;
}): Promise<ClientPdfShareResult> {
  const shareData = { files: [params.file], text: params.caption };

  if (typeof navigator !== "undefined" && navigator.canShare?.(shareData)) {
    await navigator.share(shareData);
    return "shared";
  }

  const blobUrl = URL.createObjectURL(params.file);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = params.file.name;
  link.click();
  URL.revokeObjectURL(blobUrl);

  const attachHint =
    params.caption.includes("منسلک") || params.caption.includes("attached")
      ? ""
      : "\n\n(Please attach the downloaded PDF file.)";

  window.open(
    buildWhatsAppUrl(params.phone, `${params.caption}${attachHint}`),
    "_blank",
    "noopener,noreferrer",
  );

  return "opened";
}
