"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measurementCardDataFromOrder = measurementCardDataFromOrder;
function measurementCardDataFromOrder(order) {
    return {
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        garmentLabel: order.garmentLabel,
        garmentType: order.garmentType,
        suitNo: order.suitCount,
        measurements: order.measurements,
        style: order.style,
        orderId: order.id,
        orderNumber: order.orderNumber,
    };
}
//# sourceMappingURL=measurement-card-data.js.map