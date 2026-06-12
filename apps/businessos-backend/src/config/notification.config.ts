export const notificationConfig = {
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    /** Gmail app passwords are often pasted with spaces — strip them for auth. */
    pass: (process.env.SMTP_PASS ?? "").replace(/\s/g, ""),
    from: process.env.SMTP_FROM ?? "BusinessOS <noreply@businessos.pk>",
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
    authToken: process.env.TWILIO_AUTH_TOKEN ?? "",
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM ?? "",
  },
  /** Meta WhatsApp Cloud API — direct from your shop number (no Twilio markup). */
  whatsappCloud: {
    token: process.env.WHATSAPP_CLOUD_TOKEN ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
    apiVersion: process.env.WHATSAPP_API_VERSION ?? "v21.0",
    /** Optional approved utility template for proactive reminders (Meta Business Manager). */
    reminderTemplate: process.env.WHATSAPP_TEMPLATE_REMINDER ?? "",
    readyTemplate: process.env.WHATSAPP_TEMPLATE_READY ?? "",
  },
  shopName: process.env.SHOP_NAME ?? "Demo Tailor Shop",
};

export function isSmtpConfigured() {
  return Boolean(
    notificationConfig.smtp.host &&
      notificationConfig.smtp.user &&
      notificationConfig.smtp.pass,
  );
}

export function isTwilioWhatsAppConfigured() {
  return Boolean(
    notificationConfig.twilio.accountSid &&
      notificationConfig.twilio.authToken &&
      notificationConfig.twilio.whatsappFrom,
  );
}

export function isWhatsAppCloudConfigured() {
  return Boolean(
    notificationConfig.whatsappCloud.token &&
      notificationConfig.whatsappCloud.phoneNumberId,
  );
}
