"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMeasurementCardHtml = buildMeasurementCardHtml;
const measurement_schemas_1 = require("../measurement-schemas");
const document_print_styles_1 = require("./document-print-styles");
const shop_brand_html_1 = require("./shop-brand-html");
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function formatMeasurementValue(raw) {
    if (raw === undefined || raw === null || String(raw).trim() === "") {
        return null;
    }
    const text = String(raw).trim();
    if (/^\d+(\.\d+)?$/.test(text)) {
        return `${text}"`;
    }
    return text;
}
function measurementLabel(key, t) {
    if (key in t.measurements) {
        return t.measurements[key];
    }
    return key.replace(/([A-Z])/g, " $1").trim();
}
const MEASUREMENT_GROUP_ORDER = ["size", "main"];
const measurementGroupTitleKeys = {
    size: "measurementGroupSize",
    main: "measurementGroupMain",
};
function buildMeasurementGridCells(fields, measurements, t) {
    const gridCells = fields.map((field) => {
        const label = measurementLabel(field.labelKey, t);
        const value = formatMeasurementValue(measurements[field.key]);
        const valueHtml = value
            ? `<div class="v">${escapeHtml(value)}</div>`
            : `<div class="mblank"></div>`;
        return `<div class="mcell"><div class="l">${escapeHtml(label)}</div>${valueHtml}</div>`;
    });
    while (gridCells.length % 3 !== 0) {
        gridCells.push(`<div class="mcell"><div class="l">&nbsp;</div><div class="mblank"></div></div>`);
    }
    return gridCells;
}
function buildSpecialNotes(data, t) {
    const lines = [];
    if (data.style?.notes?.trim()) {
        lines.push(data.style.notes.trim());
    }
    const schema = (0, measurement_schemas_1.getGarmentSchema)((0, measurement_schemas_1.normalizeBookingGarmentType)(data.garmentType));
    for (const field of schema.styleFields) {
        if (field.key === "notes")
            continue;
        const value = data.style?.[field.key]?.trim();
        if (!value)
            continue;
        const label = field.labelKey in t.style
            ? t.style[field.labelKey]
            : field.labelKey;
        lines.push(`${label}: ${value}`);
    }
    return lines.join("\n");
}
function buildMeasurementCardHtml({ data, shop, t, measuredDate = new Date().toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
}), }) {
    const allFields = (0, measurement_schemas_1.getWorksheetMeasurementFields)();
    const measurementSections = MEASUREMENT_GROUP_ORDER.map((group) => {
        const fields = allFields.filter((field) => (field.group ?? "main") === group);
        if (fields.length === 0)
            return "";
        const title = String(t.form[measurementGroupTitleKeys[group]]);
        const gridCells = buildMeasurementGridCells(fields, data.measurements, t);
        return `<div class="msection">
      <div class="msection-title">${escapeHtml(title)}</div>
      <div class="mgrid">${gridCells.join("")}</div>
    </div>`;
    }).join("");
    const specialNotes = buildSpecialNotes(data, t);
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
  ${document_print_styles_1.DOCUMENT_PRINT_FONTS}
  <style>${document_print_styles_1.DOCUMENT_PRINT_BASE_CSS}</style>
</head>
<body>
  <div class="dhead">
    ${(0, shop_brand_html_1.buildShopBrandHtml)(shop, t.appTagline)}
    <div class="dright">
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
//# sourceMappingURL=measurement-card-html.js.map