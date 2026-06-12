import { Module } from "@nestjs/common";
import { MeasurementController } from "./measurement.controller";
import { MeasurementRepository } from "./measurement.repository";
import { MeasurementService } from "./measurement.service";

@Module({
  controllers: [MeasurementController],
  providers: [MeasurementService, MeasurementRepository],
  exports: [MeasurementService, MeasurementRepository],
})
export class MeasurementModule {}
