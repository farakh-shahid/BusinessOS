import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import type { AuthUser } from "../../common/types/auth-user.type";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ListOrdersQueryDto } from "./dto/list-orders-query.dto";
import { OrderFilterCountsQueryDto } from "./dto/order-filter-counts-query.dto";
import { MarkOrderReadyDto } from "./dto/mark-order-ready.dto";
import { SendOrderDocumentQueryDto } from "./dto/send-order-document-query.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { ProductionPerformanceQueryDto } from "./dto/production-performance-query.dto";
import { OrderService } from "./order.service";

const MAX_PDF_BYTES = 8_000_000;

@Controller("tailor/orders")
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Get("dashboard")
  dashboard(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.orders.getDashboard(tenantId, user);
  }

  @Get("receivables")
  @UseGuards(RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  receivables(@CurrentTenant() tenantId: string) {
    return this.orders.listReceivables(tenantId);
  }

  @Post("receivables/customers/:customerId/mark-paid")
  @UseGuards(RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  markReceivableCustomerPaid(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("customerId") customerId: string,
  ) {
    return this.orders.markReceivableCustomerPaid(
      tenantId,
      customerId,
      user.id,
    );
  }

  @Get("assignments")
  @UseGuards(RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  assignments(@CurrentTenant() tenantId: string) {
    return this.orders.getAssignments(tenantId);
  }

  @Get("assignments/performance")
  @UseGuards(RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  productionPerformance(
    @CurrentTenant() tenantId: string,
    @Query() query: ProductionPerformanceQueryDto,
  ) {
    return this.orders.getProductionPerformance(
      tenantId,
      query.from,
      query.to,
      query.worker,
    );
  }

  @Get("filter-counts")
  filterCounts(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Query() query: OrderFilterCountsQueryDto,
  ) {
    return this.orders.getQuickFilterCounts(tenantId, query, user);
  }

  @Get()
  list(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Query() query: ListOrdersQueryDto,
  ) {
    return this.orders.list(tenantId, query, user);
  }

  @Get("next-number")
  nextOrderNumber(@CurrentTenant() tenantId: string) {
    return this.orders.getNextOrderNumber(tenantId);
  }

  @Get(":id")
  getById(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
  ) {
    return this.orders.getFullById(tenantId, id, user);
  }

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orders.create(tenantId, user.id, dto, user.role);
  }

  @Patch(":id")
  update(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orders.updateOrder(tenantId, id, user.id, dto, user);
  }

  @Patch(":id/status")
  updateStatus(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orders.updateStatus(tenantId, id, user.id, user, dto);
  }

  @Post(":id/reminder")
  sendReminder(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
  ) {
    return this.orders.sendReminder(tenantId, id, user.id, user);
  }

  @Patch(":id/mark-ready")
  markReady(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: MarkOrderReadyDto,
  ) {
    return this.orders.markReady(tenantId, id, user.id, dto, user);
  }

  @Post(":id/documents/whatsapp")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: MAX_PDF_BYTES },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
          cb(new BadRequestException("Only PDF files allowed"), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  sendDocumentWhatsApp(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Query() query: SendOrderDocumentQueryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.orders.sendDocumentWhatsApp(
      tenantId,
      id,
      user.id,
      query.type,
      user,
      file,
    );
  }
}
