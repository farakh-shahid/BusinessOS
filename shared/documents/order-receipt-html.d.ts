import type { DocumentDictionary } from "./dictionary";
import type { OrderFullDetail } from "../types/order-extended";
import type { TenantSettings } from "../types/settings";
export interface OrderReceiptHtmlInput {
    order: OrderFullDetail;
    shop: Pick<TenantSettings, "name" | "phone" | "email" | "address">;
    t: DocumentDictionary;
    generatedDate?: string;
}
export declare function buildOrderReceiptHtml({ order, shop, t, generatedDate, }: OrderReceiptHtmlInput): string;
