-- Add VIP flag for customer profiles
ALTER TABLE "business_os_tailor"."customers"
ADD COLUMN "is_vip" BOOLEAN NOT NULL DEFAULT false;
