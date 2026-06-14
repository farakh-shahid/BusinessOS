import type { OrderFullDetail } from "@business-os/tailor";
import type { TenantSettings } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { openHtmlForPrint } from "@/core/presentation/lib/open-html-for-print";
import { buildOrderReceiptHtml } from "./order-receipt-html";
import { buildMeasurementCardHtml } from "./measurement-card-html";
import type { MeasurementCardData } from "./measurement-card-data";

export function printOrderReceipt(
  order: OrderFullDetail,
  t: Dictionary,
  shop?: Pick<TenantSettings, "name" | "phone" | "email" | "address">,
) {
  const html = buildOrderReceiptHtml({
    order,
    shop: shop ?? { name: t.appName },
    t,
  });
  openHtmlForPrint(html);
}

export function printMeasurementCard(
  data: MeasurementCardData,
  t: Dictionary,
  shop?: Pick<TenantSettings, "name" | "phone" | "email" | "address">,
) {
  openHtmlForPrint(
    buildMeasurementCardHtml({
      data,
      shop: shop ?? { name: t.appName },
      t,
    }),
  );
}
