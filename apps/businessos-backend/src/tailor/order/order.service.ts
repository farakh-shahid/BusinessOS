import { Injectable } from "@nestjs/common";
import type {
  MarkReadyResult,
  OrderFullDetail,
  ReminderResult,
} from "@business-os/tailor";
import type { UserRole } from "../../generated/prisma/client";
import { notificationConfig } from "../../config/notification.config";
import { EmailNotificationService } from "../../core/notifications/email-notification.service";
import { WhatsAppNotificationService } from "../../core/notifications/whatsapp-notification.service";
import { buildReminderMessage } from "../../core/notifications/notification.templates";
import { garmentLabel } from "../common/tailor.mapper";
import { CloudinaryService } from "../upload/cloudinary.service";
import type { CreateOrderDto } from "./dto/create-order.dto";
import type { ListOrdersQueryDto } from "./dto/list-orders-query.dto";
import type { MarkOrderReadyDto } from "./dto/mark-order-ready.dto";
import type { UpdateOrderDto } from "./dto/update-order.dto";
import type { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrderAuditService } from "./order-audit.service";
import { OrderRepository } from "./order.repository";

@Injectable()
export class OrderService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly audit: OrderAuditService,
    private readonly whatsapp: WhatsAppNotificationService,
    private readonly email: EmailNotificationService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  getDashboard(tenantId: string) {
    return this.orders.getDashboard(tenantId);
  }

  list(tenantId: string, query?: ListOrdersQueryDto) {
    return this.orders.list(tenantId, query);
  }

  listReceivables(tenantId: string) {
    return this.orders.listReceivables(tenantId);
  }

  markReceivableCustomerPaid(
    tenantId: string,
    customerId: string,
    userId: string,
  ) {
    return this.orders.markCustomerBalancesPaid(tenantId, customerId, userId);
  }

  getAssignments(tenantId: string) {
    return this.orders.getAssignmentsOverview(tenantId);
  }

  async getFullById(
    tenantId: string,
    orderId: string,
  ): Promise<OrderFullDetail> {
    const order = await this.orders.findFullById(tenantId, orderId);
    const [auditLog, payments] = await Promise.all([
      this.audit.listForOrder(tenantId, orderId),
      this.orders.getPaymentsWithUsers(tenantId, orderId),
    ]);
    return this.orders.toOrderFullDetail(order, auditLog, payments);
  }

  getById(tenantId: string, orderId: string) {
    return this.getFullById(tenantId, orderId);
  }

  async create(tenantId: string, userId: string, dto: CreateOrderDto) {
    let order = await this.orders.create(tenantId, userId, dto);

    if (dto.dressImagePublicId && this.cloudinary.enabled()) {
      const tenantName = await this.orders.getTenantName(tenantId);
      const promoted = await this.cloudinary.promoteDraftToOrder({
        tenantId,
        tenantName,
        orderId: order.id,
        currentPublicId: dto.dressImagePublicId,
      });

      if (promoted) {
        await this.orders.updateDressImage(
          order.id,
          promoted.url,
          promoted.publicId,
        );
      }
    }

    return order;
  }

  async updateOrder(
    tenantId: string,
    orderId: string,
    userId: string,
    dto: UpdateOrderDto,
  ) {
    const existing = await this.orders.findFullById(tenantId, orderId);

    const imageRemoved =
      dto.dressImageUrl !== undefined && !dto.dressImageUrl.trim();
    const imageChanged =
      dto.dressImagePublicId !== undefined &&
      dto.dressImagePublicId !== (existing.dressImagePublicId ?? "");

    const updated = await this.orders.updateOrder(tenantId, orderId, dto, userId);

    if (this.cloudinary.enabled()) {
      if (imageRemoved && existing.dressImagePublicId) {
        await this.cloudinary.deleteImage(existing.dressImagePublicId);
      } else if (
        imageChanged &&
        existing.dressImagePublicId &&
        existing.dressImagePublicId !== updated.dressImagePublicId
      ) {
        await this.cloudinary.deleteImage(existing.dressImagePublicId);
      }
    }

    await this.audit.log(tenantId, orderId, userId, "ORDER_UPDATED", {
      fields: Object.keys(dto),
    });
    const [auditLog, payments] = await Promise.all([
      this.audit.listForOrder(tenantId, orderId),
      this.orders.getPaymentsWithUsers(tenantId, orderId),
    ]);
    return this.orders.toOrderFullDetail(updated, auditLog, payments);
  }

  async updateStatus(
    tenantId: string,
    orderId: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateOrderStatusDto,
  ) {
    const result = await this.orders.updateStatus(
      tenantId,
      orderId,
      userId,
      userRole,
      dto,
    );

    await this.audit.log(tenantId, orderId, userId, "STATUS_CHANGED", {
      from: result.previousStatus,
      to: result.nextStatus,
    });

    if (result.paymentRecorded > 0) {
      await this.audit.log(tenantId, orderId, userId, "PAYMENT_RECORDED", {
        amount: result.paymentRecorded,
        note: dto.paymentNote,
      });
    }

    return result.order;
  }

  async sendReminder(
    tenantId: string,
    orderId: string,
    userId: string,
  ): Promise<ReminderResult> {
    const order = await this.orders.findFullById(tenantId, orderId);
    const locale = order.customer.preferredLocale === "UR" ? "ur" : "en";
    const garment = garmentLabel(order.garmentType);
    const due = order.deliveryDate.toLocaleDateString("en-PK");

    const reminderCtx = {
      customerName: order.customer.name,
      garmentLabel: garment,
      orderNumber: order.orderNumber,
      shopName: order.tenant.name,
      dueDate: due,
      locale: locale as "en" | "ur",
    };
    const message = buildReminderMessage(reminderCtx);

    const wa = await this.whatsapp.sendMessage(
      order.customer.phone,
      message,
      notificationConfig.whatsappCloud.reminderTemplate
        ? {
            name: notificationConfig.whatsappCloud.reminderTemplate,
            bodyParams: [
              order.customer.name,
              garment,
              order.orderNumber,
              due,
              order.tenant.name,
            ],
          }
        : undefined,
    );

    const whatsappUrl = wa.whatsappUrl;

    await this.audit.log(tenantId, orderId, userId, "REMINDER_SENT", {
      method: wa.method,
    });

    return {
      sent: wa.sent,
      whatsappUrl,
      reason: wa.reason,
    };
  }

  async markReady(
    tenantId: string,
    orderId: string,
    userId: string,
    dto: MarkOrderReadyDto,
  ): Promise<MarkReadyResult> {
    const sendWhatsApp = dto.sendWhatsApp !== false;
    const sendEmail = dto.sendEmail === true;

    const order = await this.orders.markReady(tenantId, orderId);
    if (order.status === "READY") {
      await this.audit.log(tenantId, orderId, userId, "STATUS_CHANGED", {
        to: "ready",
        via: "mark_ready",
      });
    }

    const locale = order.customer.preferredLocale === "UR" ? "ur" : "en";
    const ctx = {
      customerName: order.customer.name,
      garmentLabel: garmentLabel(order.garmentType),
      orderNumber: order.orderNumber,
      shopName: order.tenant.name,
      locale: locale as "en" | "ur",
      balanceDue: Number(order.balanceDue),
      shopAddress: order.tenant.address ?? undefined,
      shopPhone: order.tenant.phone ?? undefined,
      whatsappFooter: order.tenant.whatsappFooter ?? undefined,
    };

    const whatsappResult = {
      attempted: false,
      sent: false,
      method: undefined as "meta_cloud" | "twilio" | "wa_me_link" | undefined,
      whatsappUrl: undefined as string | undefined,
      reason: undefined as string | undefined,
    };

    if (sendWhatsApp) {
      whatsappResult.attempted = true;
      const wa = await this.whatsapp.sendReadyNotification(
        order.customer.phone,
        ctx,
      );
      whatsappResult.sent = wa.sent;
      whatsappResult.method = wa.method;
      whatsappResult.whatsappUrl = wa.whatsappUrl;
      whatsappResult.reason = wa.reason;

      if (wa.sent) {
        await this.orders.updateNotificationTimestamps(order.id, {
          readyNotifiedAt: new Date(),
        });
      }
    }

    const emailResult = {
      attempted: false,
      sent: false,
      reason: undefined as string | undefined,
    };

    if (sendEmail) {
      emailResult.attempted = true;

      if (!order.customer.email) {
        emailResult.reason = "no_customer_email";
      } else {
        const mail = await this.email.sendReadyNotification(
          order.customer.email,
          ctx,
          dto.emailNotes,
        );
        emailResult.sent = mail.sent;
        emailResult.reason = mail.reason;

        if (mail.sent) {
          await this.orders.updateNotificationTimestamps(order.id, {
            readyEmailSentAt: new Date(),
          });
        }
      }
    }

    const refreshed = await this.orders.findById(tenantId, orderId);

    return {
      order: this.orders.toOrderDto(refreshed),
      notifications: {
        whatsapp: whatsappResult,
        email: emailResult,
      },
    };
  }
}
