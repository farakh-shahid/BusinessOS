-- Optional second mobile number for staff / users
ALTER TABLE "business_os"."users"
ADD COLUMN "phone_2" TEXT;

CREATE UNIQUE INDEX "users_phone_2_key"
ON "business_os"."users" ("phone_2")
WHERE "phone_2" IS NOT NULL;
