import type { TenantSettings } from "../types/settings";
export declare function buildShopBrandHtml(shop: Pick<TenantSettings, "name" | "phone" | "address">, taglineFallback: string): string;
