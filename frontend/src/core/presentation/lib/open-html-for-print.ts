function printViaIframe(html: string) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0",
  );
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDoc = frameWindow?.document;
  if (!frameWindow || !frameDoc) {
    iframe.remove();
    return;
  }

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();

  const cleanup = () => iframe.remove();
  frameWindow.addEventListener("afterprint", cleanup, { once: true });
  frameWindow.focus();
  frameWindow.print();
  window.setTimeout(cleanup, 2000);
}

/** Opens printable HTML in a new tab, or prints via iframe if popups are blocked. */
export function openHtmlForPrint(html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");

  if (!win) {
    URL.revokeObjectURL(url);
    printViaIframe(html);
    return;
  }

  let printed = false;
  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    win.focus();
    win.print();
    URL.revokeObjectURL(url);
  };

  win.addEventListener("load", triggerPrint, { once: true });
  window.setTimeout(triggerPrint, 1000);
}
