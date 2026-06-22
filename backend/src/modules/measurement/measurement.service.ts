import { Injectable } from "@nestjs/common";
import { MeasurementRepository } from "./measurement.repository";
import type { CreateMeasurementInput } from "./dto/create-measurement.types";
import type { UpdateMeasurementDto } from "./dto/update-measurement.dto";

@Injectable()
export class MeasurementService {
  constructor(private readonly measurements: MeasurementRepository) {}

  listByCustomer(tenantId: string, customerId: string) {
    return this.measurements.listByCustomer(tenantId, customerId);
  }

  create(tenantId: string, userId: string, dto: CreateMeasurementInput) {
    return this.measurements.create(tenantId, userId, dto);
  }

  update(tenantId: string, measurementId: string, dto: UpdateMeasurementDto) {
    return this.measurements.update(tenantId, measurementId, dto);
  }
}
