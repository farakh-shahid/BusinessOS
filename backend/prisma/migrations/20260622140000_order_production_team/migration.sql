ALTER TABLE "business_os_tailor"."orders"
ADD COLUMN "cutting_master_name" TEXT,
ADD COLUMN "stitching_master_name" TEXT;

CREATE INDEX "orders_tenant_id_cutting_master_name_idx"
ON "business_os_tailor"."orders" ("tenant_id", "cutting_master_name");

CREATE INDEX "orders_tenant_id_stitching_master_name_idx"
ON "business_os_tailor"."orders" ("tenant_id", "stitching_master_name");
