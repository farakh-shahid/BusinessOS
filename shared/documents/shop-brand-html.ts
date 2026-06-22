import type { TenantSettings } from "../types/settings";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Shop name with phone (if any) then address under the brand — no duplicate in header right. */
export function buildShopBrandHtml(
  shop: Pick<TenantSettings, "name" | "phone" | "address">,
  taglineFallback: string,
): string {
  const details: string[] = [];
  const phone = shop.phone?.trim();
  const address = shop.address?.trim();

  if (phone) details.push(phone);
  if (address) details.push(address);
  if (details.length === 0) details.push(taglineFallback);

  return `<div class="dbrand">
      ${escapeHtml(shop.name)}
      ${details.map((line) => `<span class="shop-detail">${escapeHtml(line)}</span>`).join("")}
    </div>`;
}
