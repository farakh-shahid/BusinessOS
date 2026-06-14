import type { PrismaClient } from "../src/generated/prisma/client";
import {
  FabricSource,
  GarmentType,
  LocalePreference,
  OrderStatus,
  UserRole,
} from "../src/generated/prisma/client";

const DEMO_TENANT_ID = "00000000-0000-4000-8000-000000000001";

const STAFF = [
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
  {
    id: "00000000-0000-4000-8000-000000000206",
    name: "Farhan Qureshi",
    email: "farhan@demotailor.pk",
    phone: "03001111006",
  },
] as const;

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
  fabricSource: FabricSource;
  dressCode?: string;
  suitCount?: number;
};

export const SEED_CUSTOMER_COUNT = 220;
export const SEED_ORDER_COUNT = 250;

const ORDERS: DemoOrder[] = [
  {
    id: "00000000-0000-4000-8000-000000000301",
    orderNumber: "ORD-2026-0001",
    customerIndex: 0,
    garmentType: GarmentType.SHALWAR_QAMEEZ,
    status: OrderStatus.STITCHING,
    bookingDate: "2026-06-01",
    deliveryDate: "2026-06-13",
    totalPrice: 8500,
    advancePaid: 4000,
    isRush: true,
    assignedToName: "Hassan Ali",
    fabricSource: FabricSource.CUSTOMER,
    dressCode: "Navy formal",
  },
  {
    id: "00000000-0000-4000-8000-000000000302",
    orderNumber: "ORD-2026-0002",
    customerIndex: 1,
    garmentType: GarmentType.SHERWANI,
    status: OrderStatus.CUTTING,
    bookingDate: "2026-06-03",
    deliveryDate: "2026-06-13",
    totalPrice: 22000,
    advancePaid: 10000,
    isRush: true,
    assignedToName: "Imran Butt",
    fabricSource: FabricSource.SHOP,
    dressCode: "Wedding ivory",
    suitCount: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000303",
    orderNumber: "ORD-2026-0003",
    customerIndex: 2,
    garmentType: GarmentType.WAISTCOAT,
    status: OrderStatus.PENDING,
    bookingDate: "2026-06-10",
    deliveryDate: "2026-06-13",
    totalPrice: 6500,
    advancePaid: 2000,
    isRush: false,
    assignedToName: "Usman Malik",
    fabricSource: FabricSource.SHOP,
  },
  {
    id: "00000000-0000-4000-8000-000000000304",
    orderNumber: "ORD-2026-0004",
    customerIndex: 3,
    garmentType: GarmentType.SUIT,
    status: OrderStatus.STITCHING,
    bookingDate: "2026-05-20",
    deliveryDate: "2026-06-10",
    totalPrice: 18000,
    advancePaid: 9000,
    isRush: false,
    assignedToName: "Ahmed Khan",
    fabricSource: FabricSource.CUSTOMER,
    dressCode: "Charcoal 2-piece",
  },
  {
    id: "00000000-0000-4000-8000-000000000305",
    orderNumber: "ORD-2026-0005",
    customerIndex: 4,
    garmentType: GarmentType.KURTA,
    status: OrderStatus.CUTTING,
    bookingDate: "2026-05-28",
    deliveryDate: "2026-06-08",
    totalPrice: 4500,
    advancePaid: 1500,
    isRush: false,
    assignedToName: "Bilal Sheikh",
    fabricSource: FabricSource.CUSTOMER,
  },
  {
    id: "00000000-0000-4000-8000-000000000306",
    orderNumber: "ORD-2026-0006",
    customerIndex: 5,
    garmentType: GarmentType.SHALWAR_QAMEEZ,
    status: OrderStatus.READY,
    bookingDate: "2026-05-15",
    deliveryDate: "2026-06-12",
    totalPrice: 7200,
    advancePaid: 7200,
    isRush: false,
    assignedToName: "Farhan Qureshi",
    fabricSource: FabricSource.SHOP,
  },
  {
    id: "00000000-0000-4000-8000-000000000307",
    orderNumber: "ORD-2026-0007",
    customerIndex: 6,
    garmentType: GarmentType.COAT,
    status: OrderStatus.STITCHING,
    bookingDate: "2026-06-05",
    deliveryDate: "2026-06-18",
    totalPrice: 14000,
    advancePaid: 5000,
    isRush: false,
    assignedToName: "Hassan Ali",
    fabricSource: FabricSource.SHOP,
  },
  {
    id: "00000000-0000-4000-8000-000000000308",
    orderNumber: "ORD-2026-0008",
    customerIndex: 7,
    garmentType: GarmentType.DRESS_PANT_COAT,
    status: OrderStatus.PENDING,
    bookingDate: "2026-06-08",
    deliveryDate: "2026-06-20",
    totalPrice: 25000,
    advancePaid: 8000,
    isRush: false,
    assignedToName: "Imran Butt",
    fabricSource: FabricSource.CUSTOMER,
    dressCode: "Eid 3-piece",
    suitCount: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000309",
    orderNumber: "ORD-2026-0009",
    customerIndex: 8,
    garmentType: GarmentType.SHIRT_ONLY,
    status: OrderStatus.CUTTING,
    bookingDate: "2026-06-02",
    deliveryDate: "2026-06-16",
    totalPrice: 2800,
    advancePaid: 1000,
    isRush: false,
    fabricSource: FabricSource.CUSTOMER,
  },
  {
    id: "00000000-0000-4000-8000-000000000310",
    orderNumber: "ORD-2026-0010",
    customerIndex: 9,
    garmentType: GarmentType.SHALWAR_QAMEEZ,
    status: OrderStatus.STITCHING,
    bookingDate: "2026-06-04",
    deliveryDate: "2026-06-17",
    totalPrice: 9000,
    advancePaid: 4500,
    isRush: true,
    assignedToName: "Usman Malik",
    fabricSource: FabricSource.SHOP,
  },
  {
    id: "00000000-0000-4000-8000-000000000311",
    orderNumber: "ORD-2026-0011",
    customerIndex: 0,
    garmentType: GarmentType.FROCK,
    status: OrderStatus.READY,
    bookingDate: "2026-05-25",
    deliveryDate: "2026-06-14",
    totalPrice: 12000,
    advancePaid: 6000,
    isRush: false,
    assignedToName: "Ahmed Khan",
    fabricSource: FabricSource.SHOP,
  },
  {
    id: "00000000-0000-4000-8000-000000000312",
    orderNumber: "ORD-2026-0012",
    customerIndex: 1,
    garmentType: GarmentType.SHALWAR_QAMEEZ,
    status: OrderStatus.PENDING,
    bookingDate: "2026-06-11",
    deliveryDate: "2026-06-22",
    totalPrice: 7800,
    advancePaid: 3000,
    isRush: false,
    fabricSource: FabricSource.CUSTOMER,
  },
  {
    id: "00000000-0000-4000-8000-000000000313",
    orderNumber: "ORD-2026-0013",
    customerIndex: 2,
    garmentType: GarmentType.SHERWANI,
    status: OrderStatus.DELIVERED,
    bookingDate: "2026-04-10",
    deliveryDate: "2026-05-01",
    totalPrice: 24000,
    advancePaid: 24000,
    isRush: false,
    assignedToName: "Bilal Sheikh",
    fabricSource: FabricSource.SHOP,
  },
  {
    id: "00000000-0000-4000-8000-000000000314",
    orderNumber: "ORD-2026-0014",
    customerIndex: 3,
    garmentType: GarmentType.WAISTCOAT,
    status: OrderStatus.DELIVERED,
    bookingDate: "2026-03-15",
    deliveryDate: "2026-04-05",
    totalPrice: 7000,
    advancePaid: 7000,
    isRush: false,
    assignedToName: "Farhan Qureshi",
    fabricSource: FabricSource.CUSTOMER,
  },
  {
    id: "00000000-0000-4000-8000-000000000315",
    orderNumber: "ORD-2026-0015",
    customerIndex: 4,
    garmentType: GarmentType.SUIT,
    status: OrderStatus.READY,
    bookingDate: "2026-05-30",
    deliveryDate: "2026-06-15",
    totalPrice: 19500,
    advancePaid: 10000,
    isRush: false,
    fabricSource: FabricSource.SHOP,
    dressCode: "Office navy",
  },
  {
    id: "00000000-0000-4000-8000-000000000316",
    orderNumber: "ORD-2026-0016",
    customerIndex: 5,
    garmentType: GarmentType.KURTA,
    status: OrderStatus.CANCELLED,
    bookingDate: "2026-05-01",
    deliveryDate: "2026-05-20",
    totalPrice: 4200,
    advancePaid: 1000,
    isRush: false,
    fabricSource: FabricSource.CUSTOMER,
  },
  {
    id: "00000000-0000-4000-8000-000000000317",
    orderNumber: "ORD-2026-0017",
    customerIndex: 6,
    garmentType: GarmentType.DRESS_PANTS_ONLY,
    status: OrderStatus.STITCHING,
    bookingDate: "2026-06-07",
    deliveryDate: "2026-06-19",
    totalPrice: 3500,
    advancePaid: 1500,
    isRush: false,
    assignedToName: "Hassan Ali",
    fabricSource: FabricSource.CUSTOMER,
  },
  {
    id: "00000000-0000-4000-8000-000000000318",
    orderNumber: "ORD-2026-0018",
    customerIndex: 7,
    garmentType: GarmentType.SHALWAR_QAMEEZ,
    status: OrderStatus.CUTTING,
    bookingDate: "2026-06-09",
    deliveryDate: "2026-06-21",
    totalPrice: 8200,
    advancePaid: 4000,
    isRush: true,
    fabricSource: FabricSource.SHOP,
  },
];

const SEED_TODAY = new Date("2026-06-13T00:00:00.000Z");

const GENERATED_FIRST_NAMES = [
  "Muhammad",
  "Ahmed",
  "Ali",
  "Hassan",
  "Usman",
  "Bilal",
  "Farhan",
  "Imran",
  "Kamran",
  "Saeed",
  "Tariq",
  "Shahid",
  "Waqas",
  "Junaid",
  "Faisal",
  "Nadeem",
  "Rashid",
  "Salman",
  "Yasir",
  "Zeeshan",
  "Ayesha",
  "Fatima",
  "Sana",
  "Hina",
  "Maria",
  "Zainab",
  "Nadia",
  "Rabia",
  "Sadia",
  "Amna",
] as const;

const GENERATED_LAST_NAMES = [
  "Khan",
  "Ahmed",
  "Ali",
  "Hussain",
  "Malik",
  "Sheikh",
  "Qureshi",
  "Siddiqui",
  "Butt",
  "Raza",
  "Anwar",
  "Mehmood",
  "Iqbal",
  "Akram",
  "Hashmi",
  "Chaudhry",
  "Mirza",
  "Baig",
  "Shah",
  "Abbasi",
] as const;

const SEED_GARMENT_TYPES: GarmentType[] = [
  GarmentType.SHALWAR_QAMEEZ,
  GarmentType.SHERWANI,
  GarmentType.WAISTCOAT,
  GarmentType.SUIT,
  GarmentType.KURTA,
  GarmentType.COAT,
  GarmentType.DRESS_PANT_COAT,
  GarmentType.SHIRT_ONLY,
  GarmentType.FROCK,
  GarmentType.DRESS_PANTS_ONLY,
];

const SEED_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CUTTING,
  OrderStatus.STITCHING,
  OrderStatus.STITCHING,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];

type SeedCustomer = {
  id: string;
  name: string;
  phone: string;
  locale: LocalePreference;
};

function seedUuid(suffix: number): string {
  return `00000000-0000-4000-8000-${suffix.toString(16).padStart(12, "0")}`;
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatSeedDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildCustomerRoster(): SeedCustomer[] {
  const roster: SeedCustomer[] = [...CUSTOMERS];

  for (let i = CUSTOMERS.length; i < SEED_CUSTOMER_COUNT; i += 1) {
    const firstName = GENERATED_FIRST_NAMES[i % GENERATED_FIRST_NAMES.length]!;
    const lastName =
      GENERATED_LAST_NAMES[
        Math.floor(i / GENERATED_FIRST_NAMES.length) %
          GENERATED_LAST_NAMES.length
      ]!;
    roster.push({
      id: seedUuid(0x200 + i),
      name: `${firstName} ${lastName}`,
      phone: `0301${String(60000 + i).padStart(5, "0")}`,
      locale: i % 2 === 0 ? LocalePreference.EN : LocalePreference.UR,
    });
  }

  return roster;
}

function buildOrderRoster(customerCount: number): DemoOrder[] {
  const roster: DemoOrder[] = [...ORDERS];
  const staffNames = STAFF.map((member) => member.name);

  for (let i = ORDERS.length; i < SEED_ORDER_COUNT; i += 1) {
    const customerIndex = i % customerCount;
    const garmentType = SEED_GARMENT_TYPES[i % SEED_GARMENT_TYPES.length]!;
    const status = SEED_ORDER_STATUSES[i % SEED_ORDER_STATUSES.length]!;
    const bookingDate = addDays(SEED_TODAY, -((i % 75) + 1));
    const deliveryDate = addDays(
      SEED_TODAY,
      (i % 9) - 3 + (i % 4 === 0 ? 7 : 0),
    );
    const totalPrice = 2500 + (i % 20) * 850 + (i % 3) * 500;
    const advancePaid =
      status === OrderStatus.DELIVERED
        ? i % 5 === 0
          ? Math.round(totalPrice * 0.6)
          : totalPrice
        : Math.round(totalPrice * (0.2 + (i % 4) * 0.15));
    const isRush = i % 11 === 0 || i % 17 === 0;
    const assigned =
      status === OrderStatus.DELIVERED ||
      status === OrderStatus.CANCELLED ||
      status === OrderStatus.PENDING
        ? undefined
        : staffNames[i % staffNames.length];

    roster.push({
      id: seedUuid(0x500 + i),
      orderNumber: `ORD-2026-${String(i + 1).padStart(4, "0")}`,
      customerIndex,
      garmentType,
      status,
      bookingDate: formatSeedDate(bookingDate),
      deliveryDate: formatSeedDate(deliveryDate),
      totalPrice,
      advancePaid,
      isRush,
      assignedToName: assigned,
      fabricSource: i % 2 === 0 ? FabricSource.CUSTOMER : FabricSource.SHOP,
      dressCode: i % 6 === 0 ? `Demo style ${i + 1}` : undefined,
      suitCount: garmentType === GarmentType.DRESS_PANT_COAT ? 1 : undefined,
    });
  }

  return roster;
}

const ALL_CUSTOMERS = buildCustomerRoster();
const ALL_ORDERS = buildOrderRoster(ALL_CUSTOMERS.length);

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

  for (const member of STAFF) {
    await prisma.user.upsert({
      where: { email: member.email },
      update: { name: member.name, tenantId: DEMO_TENANT_ID, role: UserRole.STAFF },
      create: {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        passwordHash,
        role: UserRole.STAFF,
        tenantId: DEMO_TENANT_ID,
        permissions: {},
      },
    });
  }

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
      },
    });
  }

  return {
    staffCount: STAFF.length,
    customerCount: ALL_CUSTOMERS.length,
    orderCount: ALL_ORDERS.length,
    assignedOrderCount: ALL_ORDERS.filter((o) => o.assignedToName).length,
  };
}
