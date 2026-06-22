-- Add new garment types
ALTER TYPE "business_os_tailor"."GarmentType" ADD VALUE IF NOT EXISTS 'COAT';
ALTER TYPE "business_os_tailor"."GarmentType" ADD VALUE IF NOT EXISTS 'DRESS_PANT_COAT';
ALTER TYPE "business_os_tailor"."GarmentType" ADD VALUE IF NOT EXISTS 'SHIRT_ONLY';
ALTER TYPE "business_os_tailor"."GarmentType" ADD VALUE IF NOT EXISTS 'DRESS_PANTS_ONLY';

-- Dress identification fields on orders
ALTER TABLE "business_os_tailor"."orders"
  ADD COLUMN IF NOT EXISTS "dress_code" TEXT,
  ADD COLUMN IF NOT EXISTS "suit_count" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "dress_image_url" TEXT;
