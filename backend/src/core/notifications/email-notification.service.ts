import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import {
  isSmtpConfigured,
  notificationConfig,
} from "../../config/notification.config";
import {
  buildEmailBody,
  buildEmailSubject,
  type ReadyNotificationContext,
} from "./notification.templates";

@Injectable()
export class EmailNotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  async sendReadyNotification(
    to: string,
    ctx: ReadyNotificationContext,
    staffNotes?: string,
  ): Promise<{ sent: boolean; reason?: string }> {
    if (!isSmtpConfigured()) {
      this.logger.warn("SMTP not configured — email skipped");
      return { sent: false, reason: "smtp_not_configured" };
    }

    const recipient = to.trim();
    if (!recipient) {
      return { sent: false, reason: "no_customer_email" };
    }

    const transporter = nodemailer.createTransport({
      host: notificationConfig.smtp.host,
      port: notificationConfig.smtp.port,
      secure: notificationConfig.smtp.port === 465,
      auth: {
        user: notificationConfig.smtp.user,
        pass: notificationConfig.smtp.pass,
      },
    });

    const subject = buildEmailSubject(ctx);
    const text = buildEmailBody(ctx, staffNotes);

    try {
      await transporter.sendMail({
        from: notificationConfig.smtp.from,
        to: recipient,
        subject,
        text,
      });
      return { sent: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown SMTP error";
      this.logger.error(`SMTP send failed: ${message}`);
      return { sent: false, reason: "smtp_send_failed" };
    }
  }
}
