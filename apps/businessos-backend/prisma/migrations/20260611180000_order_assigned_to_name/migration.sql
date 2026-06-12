-- Optional stitcher assignment per order
ALTER TABLE "business_os_tailor"."orders"
ADD COLUMN "assigned_to_name" TEXT;

CREATE INDEX "orders_tenant_id_assigned_to_name_idx"
ON "business_os_tailor"."orders" ("tenant_id", "assigned_to_name");
