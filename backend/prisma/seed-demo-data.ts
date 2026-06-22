import type { PrismaClient } from "../src/generated/prisma/client";
import {
  FabricSource,
  GarmentType,
  LocalePreference,
  OrderStatus,
  UserRole,
} from "../src/generated/prisma/client";

const DEMO_TENANT_ID = "00000000-0000-4000-8000-000000000001";

const BOOKING_STAFF = {
  id: "00000000-0000-4000-8000-000000000200",
  name: "Saleem Akhtar",
  email: "staff@demotailor.pk",
  phone: "03001111000",
} as const;

const TAILORS = [
  {
    id: "00000000-0000-4000-8000-000000000201",
    name: "Hassan Ali",
    email: "hassan@demotailor.pk",
    phone: "03001111001",
  },
  {
    id: "00000000-0000-4000-8000-000000000202",
    name: "Imran Butt",
    email: "imran@demotailor.pk",
    phone: "03001111002",
  },
  {
    id: "00000000-0000-4000-8000-000000000203",
    name: "Usman Malik",
    email: "usman@demotailor.pk",
    phone: "03001111003",
  },
  {
    id: "00000000-0000-4000-8000-000000000204",
    name: "Ahmed Khan",
    email: "ahmed@demotailor.pk",
    phone: "03001111004",
  },
  {
    id: "00000000-0000-4000-8000-000000000205",
    name: "Bilal Sheikh",
    email: "bilal@demotailor.pk",
    phone: "03001111005",
  },
] as const;

const TEAM_MEMBER_EMAILS = [
  BOOKING_STAFF.email,
  ...TAILORS.map((member) => member.email),
];

const CUSTOMERS = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    name: "Muhammad Aslam",
    phone: "03001234501",
    locale: LocalePreference.EN,
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    name: "Tariq Mehmood",
    phone: "03001234502",
    locale: LocalePreference.UR,
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    name: "Shahid Hussain",
    phone: "03001234503",
    locale: LocalePreference.EN,
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    name: "Kamran Siddiqui",
    phone: "03001234504",
    locale: LocalePreference.UR,
  },
  {
    id: "00000000-0000-4000-8000-000000000105",
    name: "Waqas Anwar",
    phone: "03001234505",
    locale: LocalePreference.EN,
  },
  {
    id: "00000000-0000-4000-8000-000000000106",
    name: "Waqas Anwar",
    phone: "03001234506",
    locale: LocalePreference.UR,
  },
  {
    id: "00000000-0000-4000-8000-000000000107",
    name: "Waqas Khan",
    phone: "03001234507",
    locale: LocalePreference.EN,
  },
  {
    id: "00000000-0000-4000-8000-000000000108",
    name: "Waqas Anwar",
    phone: "03001234508",
    locale: LocalePreference.UR,
  },
  {
    id: "00000000-0000-4000-8000-000000000109",
    name: "Saeedullah Khan",
    phone: "03001234509",
    locale: LocalePreference.EN,
  },
  {
    id: "00000000-0000-4000-8000-000000000110",
    name: "Junaid Raza",
    phone: "03001234510",
    locale: LocalePreference.UR,
  },
] as const;

type DemoOrder = {
  id: string;
  orderNumber: string;
  customerIndex: number;
  garmentType: GarmentType;
  status: OrderStatus;
  bookingDate: string;
  deliveryDate: string;
  totalPrice: number;
  advancePaid: number;
  isRush: boolean;
  assignedToName?: string;
  cuttingMasterName?: string;
  stitchingMasterName?: string;
  fabricSource: FabricSource;
  dressCode?: string;
  suitCount?: number;
};

function seedUuid(suffix: number): string {
  return `00000000-0000-4000-8000-${suffix.toString(16).padStart(12, "0")}`;
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function formatSeedDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const SEED_CUSTOMER_COUNT = CUSTOMERS.length;
export const SEED_ORDER_COUNT = 10;

function buildSeedOrders(): DemoOrder[] {
  const today = startOfLocalDay();
  const bookingDate = formatSeedDate(today);
  const deliveryOffsets = [
    ...Array(3).fill(1),
    ...Array(4).fill(2),
    ...Array(3).fill(3),
  ];
  const tailorNames = TAILORS.map((member) => member.name);

  const templates: Array<
    Omit<DemoOrder, "id" | "orderNumber" | "bookingDate" | "deliveryDate">
  > = [
    {
      customerIndex: 0,
      garmentType: GarmentType.SHALWAR_QAMEEZ,
      status: OrderStatus.STITCHING,
      totalPrice: 8500,
      advancePaid: 4000,
      isRush: true,
      assignedToName: "Hassan Ali",
      cuttingMasterName: "Imran Butt",
      stitchingMasterName: "Hassan Ali",
      fabricSource: FabricSource.CUSTOMER,
      dressCode: "Navy formal",
    },
    {
      customerIndex: 1,
      garmentType: GarmentType.SHERWANI,
      status: OrderStatus.CUTTING,
      totalPrice: 22000,
      advancePaid: 10000,
      isRush: true,
      assignedToName: "Imran Butt",
      cuttingMasterName: "Imran Butt",
      fabricSource: FabricSource.SHOP,
      dressCode: "Wedding ivory",
      suitCount: 1,
    },
    {
      customerIndex: 2,
      garmentType: GarmentType.WAISTCOAT,
      status: OrderStatus.READY,
      totalPrice: 6500,
      advancePaid: 6500,
      isRush: false,
      assignedToName: "Usman Malik",
      cuttingMasterName: "Usman Malik",
      stitchingMasterName: "Usman Malik",
      fabricSource: FabricSource.SHOP,
    },
    {
      customerIndex: 3,
      garmentType: GarmentType.SUIT,
      status: OrderStatus.PENDING,
      totalPrice: 18000,
      advancePaid: 9000,
      isRush: false,
      assignedToName: "Ahmed Khan",
      fabricSource: FabricSource.CUSTOMER,
      dressCode: "Charcoal 2-piece",
    },
    {
      customerIndex: 4,
      garmentType: GarmentType.KURTA,
      status: OrderStatus.CUTTING,
      totalPrice: 4500,
      advancePaid: 1500,
      isRush: false,
      assignedToName: "Bilal Sheikh",
      cuttingMasterName: "Bilal Sheikh",
      fabricSource: FabricSource.CUSTOMER,
    },
    {
      customerIndex: 5,
      garmentType: GarmentType.SHALWAR_QAMEEZ,
      status: OrderStatus.STITCHING,
      totalPrice: 7200,
      advancePaid: 3600,
      isRush: false,
      assignedToName: "Hassan Ali",
      cuttingMasterName: "Hassan Ali",
      stitchingMasterName: "Hassan Ali",
      fabricSource: FabricSource.SHOP,
    },
    {
      customerIndex: 6,
      garmentType: GarmentType.COAT,
      status: OrderStatus.STITCHING,
      totalPrice: 14000,
      advancePaid: 5000,
      isRush: false,
      assignedToName: "Imran Butt",
      cuttingMasterName: "Imran Butt",
      stitchingMasterName: "Imran Butt",
      fabricSource: FabricSource.SHOP,
    },
    {
      customerIndex: 7,
      garmentType: GarmentType.DRESS_PANT_COAT,
      status: OrderStatus.PENDING,
      totalPrice: 25000,
      advancePaid: 8000,
      isRush: false,
      fabricSource: FabricSource.CUSTOMER,
      dressCode: "Eid 3-piece",
      suitCount: 1,
    },
    {
      customerIndex: 8,
      garmentType: GarmentType.SHIRT_ONLY,
      status: OrderStatus.PENDING,
      totalPrice: 2800,
      advancePaid: 1000,
      isRush: false,
      fabricSource: FabricSource.CUSTOMER,
    },
    {
      customerIndex: 9,
      garmentType: GarmentType.SHALWAR_QAMEEZ,
      status: OrderStatus.CUTTING,
      totalPrice: 9000,
      advancePaid: 4500,
      isRush: false,
      assignedToName: tailorNames[4],
      cuttingMasterName: tailorNames[4],
      fabricSource: FabricSource.SHOP,
    },
  ];

  return templates.map((template, index) => ({
    id: seedUuid(0x301 + index),
    orderNumber: `ORD-2026-${String(index + 1).padStart(4, "0")}`,
    bookingDate,
    deliveryDate: formatSeedDate(addDays(today, deliveryOffsets[index]!)),
    ...template,
  }));
}

function productionTeamFields(order: DemoOrder): {
  cuttingMasterName: string | null;
  stitchingMasterName: string | null;
} {
  if (order.cuttingMasterName || order.stitchingMasterName) {
    return {
      cuttingMasterName: order.cuttingMasterName ?? null,
      stitchingMasterName: order.stitchingMasterName ?? null,
    };
  }

  const worker = order.assignedToName?.trim();
  if (!worker) {
    return { cuttingMasterName: null, stitchingMasterName: null };
  }

  const needsStitching = [
    OrderStatus.STITCHING,
    OrderStatus.READY,
    OrderStatus.DELIVERED,
  ].includes(order.status);

  return {
    cuttingMasterName: worker,
    stitchingMasterName: needsStitching ? worker : null,
  };
}

const ALL_CUSTOMERS = [...CUSTOMERS];
const ALL_ORDERS = buildSeedOrders();

const BOOKING_GARMENT_KEYS = [
  "shalwarQameez",
  "dressPantCoat",
  "sherwani",
  "kurta",
  "waistcoat",
] as const;

const garmentTypeMap: Record<(typeof BOOKING_GARMENT_KEYS)[number], GarmentType> = {
  shalwarQameez: GarmentType.SHALWAR_QAMEEZ,
  dressPantCoat: GarmentType.DRESS_PANT_COAT,
  sherwani: GarmentType.SHERWANI,
  kurta: GarmentType.KURTA,
  waistcoat: GarmentType.WAISTCOAT,
};

function measurementSeedId(customerIndex: number, garmentIndex: number) {
  const n = 500 + customerIndex * 10 + garmentIndex;
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

function sampleMeasurementsForGarment(
  garmentKey: (typeof BOOKING_GARMENT_KEYS)[number],
  customerIndex: number,
  partial = false,
) {
  const base = 38 + (customerIndex % 5);
  const bump = BOOKING_GARMENT_KEYS.indexOf(garmentKey);

  switch (garmentKey) {
    case "shalwarQameez":
      return {
        neck: "15.5",
        shoulder: String(17 + (customerIndex % 3)),
        chest: String(base + bump),
        waist: String(base - 4 + bump),
        hip: partial ? undefined : String(base - 2),
        sleeve: String(24 + (customerIndex % 2)),
        qameezLength: String(42 + (customerIndex % 2)),
        shalwarLength: partial ? undefined : String(40 + (customerIndex % 2)),
        thigh: partial ? undefined : String(22 + (customerIndex % 2)),
        armhole: partial ? undefined : "9.5",
        bicep: partial ? undefined : "14",
        wrist: partial ? undefined : "7",
      };
    case "dressPantCoat":
      return {
        neck: "15.5",
        shoulder: String(18 + bump),
        chest: String(base + 2),
        waist: String(base - 2),
        hip: partial ? undefined : String(base),
        sleeve: String(25),
        coatLength: String(30 + bump),
        trouserLength: partial ? undefined : String(41),
        inseam: partial ? undefined : "30",
        thigh: partial ? undefined : "24",
        knee: partial ? undefined : "16",
        crotch: partial ? undefined : "12",
      };
    case "sherwani":
      return {
        neck: "15.5",
        shoulder: String(18),
        chest: String(base + 1),
        stomach: partial ? undefined : String(base + 3),
        waist: String(base - 1),
        hip: partial ? undefined : String(base + 1),
        sleeve: String(25),
        sherwaniLength: String(44 + bump),
        trouserLength: partial ? undefined : String(41),
        thigh: partial ? undefined : "23",
      };
    case "kurta":
      return {
        neck: "15",
        shoulder: String(17),
        chest: String(base),
        waist: String(base - 3),
        hip: partial ? undefined : String(base - 1),
        sleeve: String(24),
        kurtaLength: String(40 + bump),
        shalwarLength: partial ? undefined : String(39),
        thigh: partial ? undefined : "22",
      };
    case "waistcoat":
      return {
        neck: "15",
        shoulder: String(17),
        chest: String(base + 1),
        waist: String(base - 2),
        hip: partial ? undefined : String(base),
        waistcoatLength: String(26 + bump),
        armhole: partial ? undefined : "9",
      };
    default:
      return {};
  }
}

function compactMeasurements(
  data: Record<string, string | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

function sampleStyleForGarment(
  garmentKey: (typeof BOOKING_GARMENT_KEYS)[number],
  customerIndex: number,
): Record<string, string> {
  switch (garmentKey) {
    case "shalwarQameez":
      return {
        collar: customerIndex % 2 === 0 ? "ban" : "regular",
        placket: customerIndex % 3 === 0 ? "hidden" : "regular",
        chestPocket: "single",
        sidePockets: customerIndex === 0 ? "double" : "single",
        gera: customerIndex === 0 ? "Round" : "Straight",
        notes:
          customerIndex === 0
            ? "Prefers soft cotton lining"
            : "Standard finish",
      };
    case "dressPantCoat":
      return {
        lapel: customerIndex % 2 === 0 ? "peak" : "notch",
        vent: "double",
        notes: "Slim fit preference",
      };
    case "sherwani":
      return {
        collar: "ban",
        notes: customerIndex === 1 ? "Wedding embroidery on collar" : "Plain",
      };
    case "kurta":
      return {
        collar: "regular",
        placket: "regular",
        gera: "Square",
        notes: "Light lining",
      };
    case "waistcoat":
      return {
        buttonStyle: customerIndex % 2 === 0 ? "singleBreast" : "doubleBreast",
        notes: "Five-button style",
      };
    default:
      return {};
  }
}

function bookingKeyFromGarmentType(
  type: GarmentType,
): (typeof BOOKING_GARMENT_KEYS)[number] | null {
  const map: Partial<
    Record<GarmentType, (typeof BOOKING_GARMENT_KEYS)[number]>
  > = {
    SHALWAR_QAMEEZ: "shalwarQameez",
    SHIRT_ONLY: "shalwarQameez",
    COAT: "dressPantCoat",
    SUIT: "dressPantCoat",
    DRESS_PANT_COAT: "dressPantCoat",
    SHERWANI: "sherwani",
    KURTA: "kurta",
    FROCK: "kurta",
    WAISTCOAT: "waistcoat",
  };
  return map[type] ?? null;
}

function sampleMeasurements(index: number) {
  return compactMeasurements(
    sampleMeasurementsForGarment("shalwarQameez", index, false),
  );
}

async function resetDemoTailorShopData(prisma: PrismaClient) {
  await prisma.orderPayment.deleteMany({ where: { tenantId: DEMO_TENANT_ID } });
  await prisma.orderAuditLog.deleteMany({ where: { tenantId: DEMO_TENANT_ID } });
  await prisma.order.deleteMany({ where: { tenantId: DEMO_TENANT_ID } });
  await prisma.measurement.deleteMany({ where: { tenantId: DEMO_TENANT_ID } });
  await prisma.customer.deleteMany({ where: { tenantId: DEMO_TENANT_ID } });
}

export async function seedDemoTailorData(
  prisma: PrismaClient,
  passwordHash: string,
  shopAdminId: string,
) {
  await resetDemoTailorShopData(prisma);

  await prisma.user.upsert({
    where: { email: BOOKING_STAFF.email },
    update: {
      name: BOOKING_STAFF.name,
      tenantId: DEMO_TENANT_ID,
      role: UserRole.STAFF,
      phone: BOOKING_STAFF.phone,
      isActive: true,
    },
    create: {
      id: BOOKING_STAFF.id,
      name: BOOKING_STAFF.name,
      email: BOOKING_STAFF.email,
      phone: BOOKING_STAFF.phone,
      passwordHash,
      role: UserRole.STAFF,
      tenantId: DEMO_TENANT_ID,
      permissions: {},
    },
  });

  for (const member of TAILORS) {
    await prisma.user.upsert({
      where: { email: member.email },
      update: {
        name: member.name,
        tenantId: DEMO_TENANT_ID,
        role: UserRole.TAILOR,
        phone: member.phone,
        isActive: true,
      },
      create: {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        passwordHash,
        role: UserRole.TAILOR,
        tenantId: DEMO_TENANT_ID,
        permissions: {},
      },
    });
  }

  await prisma.user.updateMany({
    where: {
      tenantId: DEMO_TENANT_ID,
      role: { in: [UserRole.STAFF, UserRole.TAILOR] },
      email: { notIn: TEAM_MEMBER_EMAILS },
    },
    data: { isActive: false },
  });

  const measurementIds: string[] = [];

  for (let i = 0; i < ALL_CUSTOMERS.length; i++) {
    const customer = ALL_CUSTOMERS[i];
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {
        name: customer.name,
        phone: customer.phone,
        preferredLocale: customer.locale,
        isVip: i === 0,
        tenantId: DEMO_TENANT_ID,
      },
      create: {
        id: customer.id,
        tenantId: DEMO_TENANT_ID,
        name: customer.name,
        phone: customer.phone,
        preferredLocale: customer.locale,
        isVip: i === 0,
      },
    });

    const primaryMeasurementId = seedUuid(0x401 + i);

    if (i === 0) {
      for (let g = 0; g < BOOKING_GARMENT_KEYS.length; g++) {
        const garmentKey = BOOKING_GARMENT_KEYS[g]!;
        const measurementsData = compactMeasurements(
          sampleMeasurementsForGarment(garmentKey, i, false),
        );
        const styleData = sampleStyleForGarment(garmentKey, i);
        const measurementId =
          g === 0 ? primaryMeasurementId : measurementSeedId(i, g);

        await prisma.measurement.upsert({
          where: { id: measurementId },
          update: {
            measurementsData,
            styleData,
            garmentType: garmentTypeMap[garmentKey],
          },
          create: {
            id: measurementId,
            tenantId: DEMO_TENANT_ID,
            customerId: customer.id,
            takenByUserId: shopAdminId,
            garmentType: garmentTypeMap[garmentKey],
            measurementsData,
            styleData,
            chest: measurementsData.chest ? Number(measurementsData.chest) : null,
            waist: measurementsData.waist ? Number(measurementsData.waist) : null,
            shoulder: measurementsData.shoulder
              ? Number(measurementsData.shoulder)
              : null,
            sleeve: measurementsData.sleeve ? Number(measurementsData.sleeve) : null,
            shirtLength: measurementsData.qameezLength
              ? Number(measurementsData.qameezLength)
              : measurementsData.kurtaLength
                ? Number(measurementsData.kurtaLength)
                : null,
            trouserLength: measurementsData.shalwarLength
              ? Number(measurementsData.shalwarLength)
              : measurementsData.trouserLength
                ? Number(measurementsData.trouserLength)
                : null,
          },
        });
      }

      measurementIds.push(primaryMeasurementId);
      continue;
    }

    if (i === 1) {
      const partialGarments = new Set<(typeof BOOKING_GARMENT_KEYS)[number]>([
        "kurta",
      ]);

      for (let g = 0; g < BOOKING_GARMENT_KEYS.length; g++) {
        const garmentKey = BOOKING_GARMENT_KEYS[g]!;
        const measurementsData = compactMeasurements(
          sampleMeasurementsForGarment(
            garmentKey,
            i,
            partialGarments.has(garmentKey),
          ),
        );
        const styleData = sampleStyleForGarment(garmentKey, i);
        const measurementId =
          g === 0 ? primaryMeasurementId : measurementSeedId(i, g);

        await prisma.measurement.upsert({
          where: { id: measurementId },
          update: {
            measurementsData,
            styleData,
            garmentType: garmentTypeMap[garmentKey],
          },
          create: {
            id: measurementId,
            tenantId: DEMO_TENANT_ID,
            customerId: customer.id,
            takenByUserId: shopAdminId,
            garmentType: garmentTypeMap[garmentKey],
            measurementsData,
            styleData,
            chest: measurementsData.chest ? Number(measurementsData.chest) : null,
            waist: measurementsData.waist ? Number(measurementsData.waist) : null,
            shoulder: measurementsData.shoulder
              ? Number(measurementsData.shoulder)
              : null,
            sleeve: measurementsData.sleeve ? Number(measurementsData.sleeve) : null,
          },
        });
      }

      measurementIds.push(primaryMeasurementId);
      continue;
    }

    const measurementsData = sampleMeasurements(i);
    const styleData = sampleStyleForGarment("shalwarQameez", i);
    const measurementId = primaryMeasurementId;

    await prisma.measurement.upsert({
      where: { id: measurementId },
      update: {
        measurementsData,
        styleData,
        garmentType: GarmentType.SHALWAR_QAMEEZ,
      },
      create: {
        id: measurementId,
        tenantId: DEMO_TENANT_ID,
        customerId: customer.id,
        takenByUserId: shopAdminId,
        garmentType: GarmentType.SHALWAR_QAMEEZ,
        measurementsData,
        styleData,
        chest: Number(measurementsData.chest),
        waist: Number(measurementsData.waist),
        shoulder: Number(measurementsData.shoulder),
        sleeve: Number(measurementsData.sleeve),
        shirtLength: Number(measurementsData.qameezLength),
        trouserLength: Number(measurementsData.shalwarLength),
      },
    });

    measurementIds.push(measurementId);
  }

  for (const order of ALL_ORDERS) {
    const customer = ALL_CUSTOMERS[order.customerIndex];
    const measurementId = measurementIds[order.customerIndex];
    const balanceDue = Math.max(order.totalPrice - order.advancePaid, 0);
    const bookingGarmentKey = bookingKeyFromGarmentType(order.garmentType);
    const styleData = bookingGarmentKey
      ? sampleStyleForGarment(bookingGarmentKey, order.customerIndex)
      : {};
    const productionTeam = productionTeamFields(order);

    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        status: order.status,
        deliveryDate: new Date(order.deliveryDate),
        bookingDate: new Date(order.bookingDate),
        totalPrice: order.totalPrice,
        advancePaid: order.advancePaid,
        balanceDue,
        isRush: order.isRush,
        assignedToName: order.assignedToName ?? null,
        cuttingMasterName: productionTeam.cuttingMasterName,
        stitchingMasterName: productionTeam.stitchingMasterName,
        garmentType: order.garmentType,
        fabricSource: order.fabricSource,
        dressCode: order.dressCode ?? null,
        suitCount: order.suitCount ?? 1,
        styleData,
        customerId: customer.id,
        measurementId,
        orderNumber: order.orderNumber,
      },
      create: {
        id: order.id,
        tenantId: DEMO_TENANT_ID,
        customerId: customer.id,
        createdByUserId: shopAdminId,
        measurementId,
        orderNumber: order.orderNumber,
        status: order.status,
        garmentType: order.garmentType,
        dressCode: order.dressCode ?? null,
        suitCount: order.suitCount ?? 1,
        bookingDate: new Date(order.bookingDate),
        deliveryDate: new Date(order.deliveryDate),
        measurementsData: sampleMeasurements(order.customerIndex),
        styleData,
        fabricSource: order.fabricSource,
        advancePaid: order.advancePaid,
        totalPrice: order.totalPrice,
        balanceDue,
        isRush: order.isRush,
        assignedToName: order.assignedToName ?? null,
        cuttingMasterName: productionTeam.cuttingMasterName,
        stitchingMasterName: productionTeam.stitchingMasterName,
      },
    });
  }

  return {
    staffCount: 1,
    tailorCount: TAILORS.length,
    customerCount: ALL_CUSTOMERS.length,
    orderCount: ALL_ORDERS.length,
    assignedOrderCount: ALL_ORDERS.filter((o) => o.assignedToName).length,
    bookingDate: ALL_ORDERS[0]?.bookingDate,
    deliveryTomorrow: ALL_ORDERS.filter(
      (o) =>
        o.deliveryDate ===
        formatSeedDate(addDays(startOfLocalDay(), 1)),
    ).length,
  };
}
