-- Tenant shop settings
ALTER TABLE "business_os"."tenants"
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "email" TEXT,
  ADD COLUMN IF NOT EXISTS "address" TEXT,
  ADD COLUMN IF NOT EXISTS "whatsapp_footer" TEXT;

-- Order audit & payments
CREATE TYPE "business_os_tailor"."OrderAuditAction" AS ENUM (
  'STATUS_CHANGED',
  'ORDER_UPDATED',
  'PAYMENT_RECORDED',
  'REMINDER_SENT'
);

CREATE TABLE IF NOT EXISTS "business_os_tailor"."order_audit_logs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "action" "business_os_tailor"."OrderAuditAction" NOT NULL,
  "details" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "order_audit_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "order_audit_logs_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "business_os_tailor"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "order_audit_logs_tenant_id_order_id_created_at_idx"
  ON "business_os_tailor"."order_audit_logs"("tenant_id", "order_id", "created_at" DESC);

CREATE TABLE IF NOT EXISTS "business_os_tailor"."order_payments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "recorded_by_user_id" UUID NOT NULL,
  "note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "order_payments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "order_payments_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "business_os_tailor"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "order_payments_tenant_id_order_id_idx"
  ON "business_os_tailor"."order_payments"("tenant_id", "order_id");
