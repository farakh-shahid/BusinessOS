export { DOCUMENT_PRINT_BASE_CSS, DOCUMENT_PRINT_FONTS, } from "./document-print-styles";
export { buildOrderReceiptHtml, type OrderReceiptHtmlInput, } from "./order-receipt-html";
export { buildMeasurementCardHtml, type MeasurementCardHtmlInput, } from "./measurement-card-html";
export { measurementCardDataFromOrder, type MeasurementCardData, } from "./measurement-card-data";
export type { DocumentDictionary } from "./dictionary";
export interface OrderDocumentShopInfo {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    whatsappFooter?: string;
}
