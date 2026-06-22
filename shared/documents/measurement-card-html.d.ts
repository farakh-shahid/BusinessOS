import type { DocumentDictionary } from "./dictionary";
import type { TenantSettings } from "../types/settings";
import type { MeasurementCardData } from "./measurement-card-data";
export interface MeasurementCardHtmlInput {
    data: MeasurementCardData;
    shop: Pick<TenantSettings, "name" | "phone" | "email" | "address">;
    t: DocumentDictionary;
    measuredDate?: string;
}
export declare function buildMeasurementCardHtml({ data, shop, t, measuredDate, }: MeasurementCardHtmlInput): string;
