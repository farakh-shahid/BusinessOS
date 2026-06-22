-- CreateEnum
CREATE TYPE "business_os"."TenantPlan" AS ENUM ('STANDARD', 'PREMIUM', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "business_os"."tenants" ADD COLUMN "plan" "business_os"."TenantPlan" NOT NULL DEFAULT 'STANDARD';
