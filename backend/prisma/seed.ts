import * as bcrypt from "bcrypt";
import { UserRole } from "../src/generated/prisma/client";
import { createPrismaClient } from "./client";
import { seedDemoTailorData } from "./seed-demo-data";

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
      phone: "03168843648",
      email: "admin@demotailor.pk",
      address: "Main Market, Lahore",
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

  const demo = await seedDemoTailorData(prisma, passwordHash, shopAdmin.id);

  console.log("Seed complete:");
  console.log(`  Super admin: ${superAdmin.email}`);
  console.log(`  Tenant:      ${tenant.name}`);
  console.log(`  Shop admin:  ${shopAdmin.email}`);
  console.log(`  Staff:       ${demo.staffCount} booking staff`);
  console.log(`  Tailors:     ${demo.tailorCount}`);
  console.log(`  Customers:   ${demo.customerCount}`);
  console.log(`  Orders:      ${demo.orderCount} (booked ${demo.bookingDate}, ${demo.deliveryTomorrow} due tomorrow)`);
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
