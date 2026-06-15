import { Module } from "@nestjs/common";
import { RolesGuard } from "../../core/auth/roles.guard";
import { UploadModule } from "../upload/upload.module";
import { OrderAuditService } from "./order-audit.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { OrderService } from "./order.service";

@Module({
  imports: [UploadModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderAuditService, RolesGuard],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
