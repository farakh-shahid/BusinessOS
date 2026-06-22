-- Optional phone login; email no longer required when phone is set
ALTER TABLE "business_os"."users"
ADD COLUMN "phone" TEXT;

CREATE UNIQUE INDEX "users_phone_key"
ON "business_os"."users" ("phone")
WHERE "phone" IS NOT NULL;

ALTER TABLE "business_os"."users"
ALTER COLUMN "email" DROP NOT NULL;
