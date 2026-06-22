"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildShopBrandHtml = buildShopBrandHtml;
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function buildShopBrandHtml(shop, taglineFallback) {
    const details = [];
    const phone = shop.phone?.trim();
    const address = shop.address?.trim();
    if (phone)
        details.push(phone);
    if (address)
        details.push(address);
    if (details.length === 0)
        details.push(taglineFallback);
    return `<div class="dbrand">
      ${escapeHtml(shop.name)}
      ${details.map((line) => `<span class="shop-detail">${escapeHtml(line)}</span>`).join("")}
    </div>`;
}
//# sourceMappingURL=shop-brand-html.js.map