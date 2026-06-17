ALTER TABLE "business_os"."tenants"
  ADD COLUMN IF NOT EXISTS "whatsapp_connected" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "whatsapp_phone" TEXT,
  ADD COLUMN IF NOT EXISTS "whatsapp_session" JSONB;
