import type { OrderFullDetail } from "../types/order-extended";
export interface MeasurementCardData {
    customerName: string;
    customerPhone: string;
    garmentLabel: string;
    garmentType: string;
    suitNo?: string | number;
    measurements: Record<string, string | number | undefined>;
    style?: Record<string, string | undefined>;
    orderId?: string;
    orderNumber?: string;
}
export declare function measurementCardDataFromOrder(order: OrderFullDetail): MeasurementCardData;
