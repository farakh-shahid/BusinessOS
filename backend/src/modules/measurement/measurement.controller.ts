import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import type { AuthUser } from "../../common/types/auth-user.type";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { CreateMeasurementDto } from "./dto/create-measurement.dto";
import { UpdateMeasurementDto } from "./dto/update-measurement.dto";
import { MeasurementService } from "./measurement.service";

@Controller("tailor")
@UseGuards(JwtAuthGuard)
export class MeasurementController {
  constructor(private readonly measurements: MeasurementService) {}

  @Get("customers/:customerId/measurements")
  listByCustomer(
    @CurrentTenant() tenantId: string,
    @Param("customerId") customerId: string,
  ) {
    return this.measurements.listByCustomer(tenantId, customerId);
  }

  @Post("measurements")
  create(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateMeasurementDto,
  ) {
    return this.measurements.create(tenantId, user.id, dto);
  }

  @Patch("measurements/:id")
  update(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateMeasurementDto,
  ) {
    return this.measurements.update(tenantId, id, dto);
  }
}
