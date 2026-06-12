import { Module } from "@nestjs/common";
import { OrderAuditService } from "./order-audit.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { OrderService } from "./order.service";

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderAuditService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
