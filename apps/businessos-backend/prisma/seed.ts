import * as bcrypt from "bcrypt";
import { UserRole } from "../src/generated/prisma/client";
import { createPrismaClient } from "./client";

const prisma = createPrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("changeme123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@businessos.pk" },
    update: {},
    create: {
      name: "Platform Super Admin",
      email: "superadmin@businessos.pk",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      permissions: {},
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    update: { name: "Demo Tailor Shop" },
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Demo Tailor Shop",
    },
  });

  const shopAdmin = await prisma.user.upsert({
    where: { email: "admin@demotailor.pk" },
    update: {},
    create: {
      name: "Shop Owner",
      email: "admin@demotailor.pk",
      passwordHash,
      role: UserRole.ADMIN,
      tenantId: tenant.id,
      permissions: {},
    },
  });

  console.log("Seed complete:");
  console.log(`  Super admin: ${superAdmin.email}`);
  console.log(`  Tenant:      ${tenant.name}`);
  console.log(`  Shop admin:  ${shopAdmin.email}`);
  console.log("  Password:    changeme123 (change in production)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
