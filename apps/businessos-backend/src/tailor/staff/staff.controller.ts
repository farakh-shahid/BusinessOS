import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import type { AuthUser } from "../../common/types/auth-user.type";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { CreateStaffDto, UpdateStaffDto } from "./dto/staff.dto";
import { StaffService } from "./staff.service";

@Controller("tailor/staff")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
export class StaffController {
  constructor(private readonly staff: StaffService) {}

  @Get()
  list(@CurrentTenant() tenantId: string) {
    return this.staff.list(tenantId);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateStaffDto) {
    return this.staff.create(tenantId, dto);
  }

  @Patch(":id")
  update(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staff.update(tenantId, id, dto, user.id);
  }

  @Delete(":id")
  revoke(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
  ) {
    return this.staff.revokeAccess(tenantId, id, user.id);
  }
}
