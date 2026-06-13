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
    name: "Nadeem Akhtar",
    phone: "03001234505",
    locale: LocalePreference.EN,
  },
  {
    id: "00000000-0000-4000-8000-000000000106",
    name: "Rashid Iqbal",
    phone: "03001234506",
    locale: LocalePreference.UR,
  },
  {
    id: "00000000-0000-4000-8000-000000000107",
    name: "Faisal Mahmood",
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

function sampleMeasurements(index: number) {
  const base = 38 + (index % 5);
  return {
    chest: String(base),
    waist: String(base - 4),
    shoulder: String(17 + (index % 3)),
    sleeve: String(24 + (index % 2)),
    qameezLength: String(42 + (index % 2)),
    trouserLength: String(40 + (index % 2)),
  };
}

export async function seedDemoTailorData(
  prisma: PrismaClient,
  passwordHash: string,
  shopAdminId: string,
) {
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

  for (let i = 0; i < CUSTOMERS.length; i++) {
    const customer = CUSTOMERS[i];
    await prisma.customer.upsert({
      where: {
        tenantId_phone: {
          tenantId: DEMO_TENANT_ID,
          phone: customer.phone,
        },
      },
      update: {
        name: customer.name,
        preferredLocale: customer.locale,
      },
      create: {
        id: customer.id,
        tenantId: DEMO_TENANT_ID,
        name: customer.name,
        phone: customer.phone,
        preferredLocale: customer.locale,
      },
    });

    const measurementsData = sampleMeasurements(i);
    const measurementId = `00000000-0000-4000-8000-0000000004${String(i + 1).padStart(2, "0")}`;

    await prisma.measurement.upsert({
      where: { id: measurementId },
      update: {
        measurementsData,
        garmentType: GarmentType.SHALWAR_QAMEEZ,
      },
      create: {
        id: measurementId,
        tenantId: DEMO_TENANT_ID,
        customerId: customer.id,
        takenByUserId: shopAdminId,
        garmentType: GarmentType.SHALWAR_QAMEEZ,
        measurementsData,
        styleData: {},
        chest: Number(measurementsData.chest),
        waist: Number(measurementsData.waist),
        shoulder: Number(measurementsData.shoulder),
        sleeve: Number(measurementsData.sleeve),
        shirtLength: Number(measurementsData.qameezLength),
        trouserLength: Number(measurementsData.trouserLength),
      },
    });

    measurementIds.push(measurementId);
  }

  for (const order of ORDERS) {
    const customer = CUSTOMERS[order.customerIndex];
    const measurementId = measurementIds[order.customerIndex];
    const balanceDue = Math.max(order.totalPrice - order.advancePaid, 0);

    await prisma.order.upsert({
      where: {
        tenantId_orderNumber: {
          tenantId: DEMO_TENANT_ID,
          orderNumber: order.orderNumber,
        },
      },
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
        styleData: {},
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
    customerCount: CUSTOMERS.length,
    orderCount: ORDERS.length,
    assignedOrderCount: ORDERS.filter((o) => o.assignedToName).length,
  };
}
