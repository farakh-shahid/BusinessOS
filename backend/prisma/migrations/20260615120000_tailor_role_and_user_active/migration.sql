-- Add tailor/worker role and account access flag
ALTER TYPE "business_os"."UserRole" ADD VALUE 'TAILOR';

ALTER TABLE "business_os"."users"
ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;
