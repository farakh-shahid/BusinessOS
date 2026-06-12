import { Module } from "@nestjs/common";
import { AnalyticsModule } from "./analytics/analytics.module";
import { CustomerModule } from "./customer/customer.module";
import { MeasurementModule } from "./measurement/measurement.module";
import { OrderModule } from "./order/order.module";
import { SettingsModule } from "./settings/settings.module";
import { StaffModule } from "./staff/staff.module";
import { UploadModule } from "./upload/upload.module";

@Module({
  imports: [
    CustomerModule,
    MeasurementModule,
    OrderModule,
    AnalyticsModule,
    SettingsModule,
    StaffModule,
    UploadModule,
  ],
})
export class TailorModule {}
