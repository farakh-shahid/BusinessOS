import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import type { AuthUser } from "../../common/types/auth-user.type";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ListOrdersQueryDto } from "./dto/list-orders-query.dto";
import { MarkOrderReadyDto } from "./dto/mark-order-ready.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrderService } from "./order.service";

@Controller("tailor/orders")
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Get("dashboard")
  dashboard(@CurrentTenant() tenantId: string) {
    return this.orders.getDashboard(tenantId);
  }

  @Get("receivables")
  receivables(@CurrentTenant() tenantId: string) {
    return this.orders.listReceivables(tenantId);
  }

  @Get("assignments")
  assignments(@CurrentTenant() tenantId: string) {
    return this.orders.getAssignments(tenantId);
  }

  @Get()
  list(@CurrentTenant() tenantId: string, @Query() query: ListOrdersQueryDto) {
    return this.orders.list(tenantId, query);
  }

  @Get(":id")
  getById(@CurrentTenant() tenantId: string, @Param("id") id: string) {
    return this.orders.getFullById(tenantId, id);
  }

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orders.create(tenantId, user.id, dto);
  }

  @Patch(":id")
  update(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orders.updateOrder(tenantId, id, user.id, dto);
  }

  @Patch(":id/status")
  updateStatus(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orders.updateStatus(tenantId, id, user.id, user.role, dto);
  }

  @Post(":id/reminder")
  sendReminder(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
  ) {
    return this.orders.sendReminder(tenantId, id, user.id);
  }

  @Patch(":id/mark-ready")
  markReady(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: MarkOrderReadyDto,
  ) {
    return this.orders.markReady(tenantId, id, user.id, dto);
  }
}
