export async function htmlToPdfBlob(html: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
    iframe.srcdoc = html;
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const doc = iframe.contentDocument;
        const target = doc?.body;
        if (!target) {
          throw new Error("Failed to render document");
        }

        const html2pdf = (await import("html2pdf.js")).default;
        const blob = await html2pdf()
          .set({
            margin: [10, 10, 10, 10],
            filename: "document.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(target)
          .outputPdf("blob");

        resolve(blob);
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(iframe);
      }
    };

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      reject(new Error("Failed to load document"));
    };
  });
}

export function pdfBlobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: "application/pdf" });
}
