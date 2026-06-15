import { Injectable, ForbiddenException } from "@nestjs/common";
import type {
  MarkReadyResult,
  OrderDocumentWhatsAppResult,
  OrderFullDetail,
  ReminderResult,
} from "@business-os/tailor";
import type { UserRole } from "../../generated/prisma/client";
import type { AuthUser } from "../../common/types/auth-user.type";
import {
  canCreateOrders,
  isTailorRole,
  orderAssignedToUser,
  shouldHideFinancials,
  shouldScopeOrdersToAssignee,
} from "../../common/utils/user-role.util";
import { notificationConfig } from "../../config/notification.config";
import { EmailNotificationService } from "../../core/notifications/email-notification.service";
import { WhatsAppNotificationService } from "../../core/notifications/whatsapp-notification.service";
import {
  buildReminderMessage,
  buildOrderDocumentWhatsAppCaption,
  buildOrderDocumentWhatsAppFallbackMessage,
  orderDocumentFilename,
  type OrderDocumentType,
} from "../../core/notifications/notification.templates";
import { garmentLabel } from "../common/tailor.mapper";
import { CloudinaryService } from "../upload/cloudinary.service";
import type { CreateOrderDto } from "./dto/create-order.dto";
import type { ListOrdersQueryDto } from "./dto/list-orders-query.dto";
import type { OrderFilterCountsQueryDto } from "./dto/order-filter-counts-query.dto";
import type { MarkOrderReadyDto } from "./dto/mark-order-ready.dto";
import type { UpdateOrderDto } from "./dto/update-order.dto";
import type { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrderAuditService } from "./order-audit.service";
import {
  sanitizeDashboardForStaff,
  sanitizeOrderFullDetailForStaff,
} from "./dashboard-staff-sanitize.helper";
import { filterDashboardForAssignee } from "./dashboard-tailor-filter.helper";
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

  async getDashboard(tenantId: string, user: AuthUser) {
    let data = await this.orders.getDashboard(tenantId);

    if (shouldScopeOrdersToAssignee(user.role)) {
      const readyOrders = await this.orders.findReadyOrdersForAssignee(
        tenantId,
        user.name,
      );
      data = filterDashboardForAssignee(data, user.name, readyOrders);
    }

    return shouldHideFinancials(user.role)
      ? sanitizeDashboardForStaff(data)
      : data;
  }

  list(tenantId: string, query: ListOrdersQueryDto | undefined, user: AuthUser) {
    const scopedQuery = this.scopeListQueryForUser(query, user);
    return this.orders.list(tenantId, scopedQuery);
  }

  getQuickFilterCounts(
    tenantId: string,
    query: OrderFilterCountsQueryDto | undefined,
    user: AuthUser,
  ) {
    const scopedQuery = this.scopeFilterCountsQueryForUser(query, user);
    return this.orders.getQuickFilterCounts(tenantId, scopedQuery);
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
    user?: AuthUser,
  ): Promise<OrderFullDetail> {
    const order = await this.orders.findFullById(tenantId, orderId);
    this.assertTailorOrderAccess(order, user);

    const [auditLog, payments] = await Promise.all([
      this.audit.listForOrder(tenantId, orderId),
      this.orders.getPaymentsWithUsers(tenantId, orderId),
    ]);
    const detail = this.orders.toOrderFullDetail(order, auditLog, payments);
    return user && shouldHideFinancials(user.role)
      ? sanitizeOrderFullDetailForStaff(detail)
      : detail;
  }

  getById(tenantId: string, orderId: string, user?: AuthUser) {
    return this.getFullById(tenantId, orderId, user);
  }

  async create(tenantId: string, userId: string, dto: CreateOrderDto, userRole: UserRole) {
    if (!canCreateOrders(userRole)) {
      throw new ForbiddenException("You cannot create orders");
    }

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
    user?: AuthUser,
  ) {
    if (user && !canCreateOrders(user.role)) {
      throw new ForbiddenException("You cannot edit orders");
    }

    const existing = await this.orders.findFullById(tenantId, orderId);
    this.assertTailorOrderAccess(existing, user);

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
    const detail = this.orders.toOrderFullDetail(updated, auditLog, payments);
    return user && shouldHideFinancials(user.role)
      ? sanitizeOrderFullDetailForStaff(detail)
      : detail;
  }

  async updateStatus(
    tenantId: string,
    orderId: string,
    userId: string,
    user: AuthUser,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.orders.findById(tenantId, orderId);
    this.assertTailorOrderAccess(order, user);

    const result = await this.orders.updateStatus(
      tenantId,
      orderId,
      userId,
      user.role,
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
    user: AuthUser,
  ): Promise<ReminderResult> {
    const order = await this.orders.findFullById(tenantId, orderId);
    this.assertTailorOrderAccess(order, user);
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
    user: AuthUser,
  ): Promise<MarkReadyResult> {
    const existing = await this.orders.findFullById(tenantId, orderId);
    this.assertTailorOrderAccess(existing, user);

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

  async sendDocumentWhatsApp(
    tenantId: string,
    orderId: string,
    userId: string,
    file: Express.Multer.File,
    documentType: OrderDocumentType,
    user: AuthUser,
  ): Promise<OrderDocumentWhatsAppResult> {
    const order = await this.orders.findById(tenantId, orderId);
    this.assertTailorOrderAccess(order, user);

    const locale = order.customer.preferredLocale === "UR" ? "ur" : "en";
    const docCtx = {
      customerName: order.customer.name,
      orderNumber: order.orderNumber,
      shopName: order.tenant.name,
      locale: locale as "en" | "ur",
      documentType,
      whatsappFooter: order.tenant.whatsappFooter ?? undefined,
    };

    const caption = buildOrderDocumentWhatsAppCaption(docCtx);
    const fallbackMessage = buildOrderDocumentWhatsAppFallbackMessage(docCtx);
    const filename = orderDocumentFilename(documentType, order.orderNumber);

    const wa = await this.whatsapp.sendDocument({
      phone: order.customer.phone,
      caption,
      filename,
      fallbackMessage,
      pdfBuffer: file.buffer,
    });

    await this.audit.log(tenantId, orderId, userId, "ORDER_UPDATED", {
      documentType,
      via: "whatsapp_pdf",
      method: wa.method,
      sent: wa.sent,
    });

    return {
      sent: wa.sent,
      method: wa.method,
      whatsappUrl: wa.whatsappUrl,
      reason: wa.reason,
    };
  }

  private assertTailorOrderAccess(
    order: { assignedToName?: string | null },
    user?: AuthUser,
  ) {
    if (!user || !isTailorRole(user.role)) return;

    if (!orderAssignedToUser(order, user.name)) {
      throw new ForbiddenException("You can only access your assigned orders");
    }
  }

  private scopeListQueryForUser(
    query: ListOrdersQueryDto | undefined,
    user: AuthUser,
  ): ListOrdersQueryDto | undefined {
    if (!shouldScopeOrdersToAssignee(user.role)) return query;

    return { ...query, assignedTo: user.name };
  }

  private scopeFilterCountsQueryForUser(
    query: OrderFilterCountsQueryDto | undefined,
    user: AuthUser,
  ): OrderFilterCountsQueryDto | undefined {
    if (!shouldScopeOrdersToAssignee(user.role)) return query;

    return { ...query, assignedTo: user.name };
  }
}
