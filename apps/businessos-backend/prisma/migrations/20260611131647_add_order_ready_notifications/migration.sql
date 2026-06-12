-- AlterTable
ALTER TABLE "business_os_tailor"."orders" ADD COLUMN     "ready_email_sent_at" TIMESTAMP(3),
ADD COLUMN     "ready_notified_at" TIMESTAMP(3);
