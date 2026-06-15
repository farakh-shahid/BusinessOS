import type { TenantSettings } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
} from "@business-os/tailor";
import type { MeasurementCardData } from "./measurement-card-data";
import {
  DOCUMENT_PRINT_BASE_CSS,
  DOCUMENT_PRINT_FONTS,
} from "./document-print-styles";

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMeasurementValue(raw: string | number | undefined): string | null {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return null;
  }
  const text = String(raw).trim();
  if (/^\d+(\.\d+)?$/.test(text)) {
    return `${text}"`;
  }
  return text;
}

function measurementLabel(key: string, t: Dictionary): string {
  if (key in t.measurements) {
    return t.measurements[key as keyof typeof t.measurements].toUpperCase();
  }
  return key.replace(/([A-Z])/g, " $1").trim().toUpperCase();
}

const MEASUREMENT_GROUP_ORDER = ["body", "upper", "lower"] as const;

const measurementGroupTitleKeys: Record<
  (typeof MEASUREMENT_GROUP_ORDER)[number],
  keyof Dictionary["orderDetail"]
> = {
  body: "measurementGroupUpperBody",
  upper: "measurementGroupLengths",
  lower: "measurementGroupLowerBody",
};

function buildMeasurementGridCells(
  fields: ReturnType<typeof getGarmentSchema>["measurementFields"],
  measurements: MeasurementCardData["measurements"],
  t: Dictionary,
): string[] {
  const gridCells = fields.map((field) => {
    const label = measurementLabel(field.labelKey, t);
    const value = formatMeasurementValue(measurements[field.key]);
    const valueHtml = value
      ? `<div class="v">${escapeHtml(value)}</div>`
      : `<div class="mblank"></div>`;
    return `<div class="mcell"><div class="l">${escapeHtml(label)}</div>${valueHtml}</div>`;
  });

  while (gridCells.length % 3 !== 0) {
    gridCells.push(
      `<div class="mcell"><div class="l">&nbsp;</div><div class="mblank"></div></div>`,
    );
  }

  return gridCells;
}

function buildSpecialNotes(data: MeasurementCardData, t: Dictionary): string {
  const lines: string[] = [];

  if (data.style?.notes?.trim()) {
    lines.push(data.style.notes.trim());
  }

  const schema = getGarmentSchema(normalizeBookingGarmentType(data.garmentType));
  for (const field of schema.styleFields) {
    if (field.key === "notes") continue;
    const value = data.style?.[field.key]?.trim();
    if (!value) continue;
    const label =
      field.labelKey in t.style
        ? t.style[field.labelKey as keyof typeof t.style]
        : field.labelKey;
    lines.push(`${label}: ${value}`);
  }

  return lines.join("\n");
}

export interface MeasurementCardHtmlInput {
  data: MeasurementCardData;
  shop: Pick<TenantSettings, "name" | "phone" | "email" | "address">;
  t: Dictionary;
  measuredDate?: string;
}

export function buildMeasurementCardHtml({
  data,
  shop,
  t,
  measuredDate = new Date().toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
}: MeasurementCardHtmlInput): string {
  const schema = getGarmentSchema(normalizeBookingGarmentType(data.garmentType));
  const measurementSections = MEASUREMENT_GROUP_ORDER.map((group) => {
    const fields = schema.measurementFields.filter(
      (field) => (field.group ?? "body") === group,
    );
    if (fields.length === 0) return "";

    const title = String(t.orderDetail[measurementGroupTitleKeys[group]]);
    const gridCells = buildMeasurementGridCells(fields, data.measurements, t);

    return `<div class="msection">
      <div class="msection-title">${escapeHtml(title)}</div>
      <div class="mgrid">${gridCells.join("")}</div>
    </div>`;
  }).join("");

  const specialNotes = buildSpecialNotes(data, t);
  const tagline = (shop.address ?? t.appTagline).toUpperCase();
  const suitLine = data.suitNo
    ? `<div class="s">${escapeHtml(t.receipt.measurementCardSuitNo)}: ${escapeHtml(data.suitNo)}</div>`
    : data.orderNumber
      ? `<div class="s">#${escapeHtml(data.orderNumber)}</div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(t.print.measurementCard)} — ${escapeHtml(data.customerName)}</title>
  ${DOCUMENT_PRINT_FONTS}
  <style>${DOCUMENT_PRINT_BASE_CSS}</style>
</head>
<body>
  <div class="dhead">
    <div class="dbrand">
      ${escapeHtml(shop.name)}
      <small>${escapeHtml(tagline)}</small>
    </div>
    <div class="dright">
      ${shop.phone ? `📞 ${escapeHtml(shop.phone)}<br>` : ""}
      ${shop.address ? `${escapeHtml(shop.address)}<br>` : ""}
      ${escapeHtml(t.receipt.measurementCardCustomerRecord)}
    </div>
  </div>

  <div class="dtitle">${escapeHtml(t.print.measurementCard)}</div>

  <div class="meta-row">
    <div class="meta-block">
      <div class="k">${escapeHtml(t.receipt.measurementCardCustomer)}</div>
      <div class="v">${escapeHtml(data.customerName)}</div>
      <div class="s">${escapeHtml(data.customerPhone)}</div>
    </div>
    <div class="meta-block right">
      <div class="k">${escapeHtml(t.receipt.garment)}</div>
      <div class="v">${escapeHtml(data.garmentLabel)}</div>
      ${suitLine}
    </div>
  </div>

  <div class="units-note">${escapeHtml(t.receipt.measurementCardUnits)}</div>

  ${measurementSections}

  <div style="margin-top:16px">
    <div class="notes-label">${escapeHtml(t.receipt.measurementCardSpecialNotes)}</div>
    <div class="notes-box">${specialNotes ? escapeHtml(specialNotes) : ""}</div>
  </div>

  <div class="stamp">
    <div class="sig">${escapeHtml(t.receipt.measurementCardMeasuredBy)}</div>
    <div class="sig">${escapeHtml(t.receipt.dateLabel)}: ${escapeHtml(measuredDate)}</div>
  </div>

  <div class="dfoot">
    <span>${escapeHtml(t.receipt.measurementCardKeepReference)}</span>
    <span>${escapeHtml(shop.name)}</span>
  </div>
</body>
</html>`;
}
