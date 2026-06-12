-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "business_os";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "business_os_tailor";

-- CreateEnum
CREATE TYPE "business_os"."UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "business_os_tailor"."LocalePreference" AS ENUM ('EN', 'UR');

-- CreateEnum
CREATE TYPE "business_os_tailor"."MeasurementUnit" AS ENUM ('INCHES', 'CM');

-- CreateEnum
CREATE TYPE "business_os_tailor"."PocketOption" AS ENUM ('NONE', 'SINGLE', 'DOUBLE');

-- CreateEnum
CREATE TYPE "business_os_tailor"."CollarType" AS ENUM ('REGULAR', 'BAN', 'SPREAD', 'OTHER');

-- CreateEnum
CREATE TYPE "business_os_tailor"."PlacketType" AS ENUM ('REGULAR', 'HIDDEN', 'OTHER');

-- CreateEnum
CREATE TYPE "business_os_tailor"."FabricSource" AS ENUM ('CUSTOMER', 'SHOP');

-- CreateEnum
CREATE TYPE "business_os_tailor"."GarmentType" AS ENUM ('SHALWAR_QAMEEZ', 'SHERWANI', 'SUIT', 'FROCK', 'KURTA', 'WAISTCOAT');

-- CreateEnum
CREATE TYPE "business_os_tailor"."OrderStatus" AS ENUM ('PENDING', 'CUTTING', 'STITCHING', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "business_os"."tenants" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_os"."users" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "business_os"."UserRole" NOT NULL DEFAULT 'STAFF',
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_os_tailor"."customers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "preferred_locale" "business_os_tailor"."LocalePreference" NOT NULL DEFAULT 'EN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_os_tailor"."measurements" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "taken_by_user_id" UUID,
    "unit" "business_os_tailor"."MeasurementUnit" NOT NULL DEFAULT 'INCHES',
    "chest" DECIMAL(5,2),
    "waist" DECIMAL(5,2),
    "shoulder" DECIMAL(5,2),
    "sleeve" DECIMAL(5,2),
    "neck" DECIMAL(5,2),
    "shirt_length" DECIMAL(5,2),
    "trouser_length" DECIMAL(5,2),
    "hip" DECIMAL(5,2),
    "thigh" DECIMAL(5,2),
    "chest_pocket" "business_os_tailor"."PocketOption",
    "side_pockets" "business_os_tailor"."PocketOption",
    "collar" "business_os_tailor"."CollarType",
    "placket" "business_os_tailor"."PlacketType",
    "gera" TEXT,
    "notes" TEXT,
    "email_sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_os_tailor"."orders" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "created_by_user_id" UUID NOT NULL,
    "measurement_id" UUID,
    "order_number" TEXT NOT NULL,
    "status" "business_os_tailor"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "garment_type" "business_os_tailor"."GarmentType" NOT NULL,
    "delivery_date" DATE NOT NULL,
    "fabric_source" "business_os_tailor"."FabricSource" NOT NULL,
    "fabric_notes" TEXT,
    "chest_pocket" "business_os_tailor"."PocketOption",
    "side_pockets" "business_os_tailor"."PocketOption",
    "collar" "business_os_tailor"."CollarType",
    "placket" "business_os_tailor"."PlacketType",
    "gera" TEXT,
    "style_notes" TEXT,
    "advance_paid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_price" DECIMAL(12,2) NOT NULL,
    "balance_due" DECIMAL(12,2) NOT NULL,
    "is_rush" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "business_os"."users"("email");

-- CreateIndex
CREATE INDEX "users_tenant_id_idx" ON "business_os"."users"("tenant_id");

-- CreateIndex
CREATE INDEX "customers_tenant_id_name_idx" ON "business_os_tailor"."customers"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_tenant_id_phone_key" ON "business_os_tailor"."customers"("tenant_id", "phone");

-- CreateIndex
CREATE INDEX "measurements_tenant_id_customer_id_created_at_idx" ON "business_os_tailor"."measurements"("tenant_id", "customer_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "orders_tenant_id_status_idx" ON "business_os_tailor"."orders"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "orders_tenant_id_delivery_date_idx" ON "business_os_tailor"."orders"("tenant_id", "delivery_date");

-- CreateIndex
CREATE UNIQUE INDEX "orders_tenant_id_order_number_key" ON "business_os_tailor"."orders"("tenant_id", "order_number");

-- AddForeignKey
ALTER TABLE "business_os"."users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "business_os"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."customers" ADD CONSTRAINT "customers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "business_os"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."measurements" ADD CONSTRAINT "measurements_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "business_os"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."measurements" ADD CONSTRAINT "measurements_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "business_os_tailor"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."measurements" ADD CONSTRAINT "measurements_taken_by_user_id_fkey" FOREIGN KEY ("taken_by_user_id") REFERENCES "business_os"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."orders" ADD CONSTRAINT "orders_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "business_os"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "business_os_tailor"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."orders" ADD CONSTRAINT "orders_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "business_os"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_os_tailor"."orders" ADD CONSTRAINT "orders_measurement_id_fkey" FOREIGN KEY ("measurement_id") REFERENCES "business_os_tailor"."measurements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
