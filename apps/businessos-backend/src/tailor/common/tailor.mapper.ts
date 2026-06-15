import type { OrderStatus as ApiOrderStatus } from "@business-os/tailor";
import type {
  CollarType,
  FabricSource,
  GarmentType,
  LocalePreference,
  MeasurementUnit,
  OrderStatus,
  PlacketType,
  PocketOption,
} from "../../generated/prisma/client";

const garmentMap: Record<string, GarmentType> = {
  shalwarQameez: "SHALWAR_QAMEEZ",
  waistcoat: "WAISTCOAT",
  coat: "COAT",
  dressPantCoat: "DRESS_PANT_COAT",
  shirtOnly: "SHIRT_ONLY",
  dressPantsOnly: "DRESS_PANTS_ONLY",
  sherwani: "SHERWANI",
  suit: "SUIT",
  frock: "FROCK",
  kurta: "KURTA",
};

const prismaGarmentTypes = new Set<string>(Object.values(garmentMap));

export function toGarmentType(value: string): GarmentType {
  const mapped = garmentMap[value];
  if (mapped) return mapped;
  if (prismaGarmentTypes.has(value)) return value as GarmentType;
  return "SHALWAR_QAMEEZ";
}

const pocketMap: Record<string, PocketOption> = {
  none: "NONE",
  single: "SINGLE",
  double: "DOUBLE",
};

const collarMap: Record<string, CollarType> = {
  regular: "REGULAR",
  ban: "BAN",
  round: "REGULAR",
  spread: "SPREAD",
  other: "OTHER",
};

const placketMap: Record<string, PlacketType> = {
  regular: "REGULAR",
  hidden: "HIDDEN",
  other: "OTHER",
};

export function toPocketOption(value?: string): PocketOption | undefined {
  if (!value) return undefined;
  return pocketMap[value];
}

export function toCollarType(value?: string): CollarType | undefined {
  if (!value) return undefined;
  return collarMap[value];
}

export function toPlacketType(value?: string): PlacketType | undefined {
  if (!value) return undefined;
  return placketMap[value];
}

export function toFabricSource(value: string): FabricSource {
  return value === "shop" ? "SHOP" : "CUSTOMER";
}

export function toLocalePreference(value?: string): LocalePreference {
  return value === "ur" ? "UR" : "EN";
}

export function parseDecimal(value?: string | number | null): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function customerInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDueDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function resolveDisplayStatus(
  status: OrderStatus,
  deliveryDate: Date,
): ApiOrderStatus {
  if (status === "DELIVERED") return "delivered";
  if (status === "CANCELLED") return "cancelled";
  if (status === "READY") return "ready";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deliveryDate);
  due.setHours(0, 0, 0, 0);

  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "due_today";

  if (status === "CUTTING") return "cutting";
  if (status === "STITCHING") return "stitching";
  return "pending";
}

const orderStatusMap: Record<string, OrderStatus> = {
  pending: "PENDING",
  cutting: "CUTTING",
  stitching: "STITCHING",
  ready: "READY",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
};

export function toOrderStatus(value: string): OrderStatus {
  return orderStatusMap[value] ?? "PENDING";
}

export function orderStatusKey(status: OrderStatus): string {
  const keys: Record<OrderStatus, string> = {
    PENDING: "pending",
    CUTTING: "cutting",
    STITCHING: "stitching",
    READY: "ready",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  };
  return keys[status];
}

export function garmentLabel(type: GarmentType): string {
  const labels: Record<GarmentType, string> = {
    SHALWAR_QAMEEZ: "Shalwar Qameez",
    WAISTCOAT: "Waistcoat",
    COAT: "Coat",
    DRESS_PANT_COAT: "Dress Pant + Coat",
    SHIRT_ONLY: "Shirt Only",
    DRESS_PANTS_ONLY: "Dress Pants Only",
    SHERWANI: "Sherwani",
    SUIT: "Suit",
    FROCK: "Frock",
    KURTA: "Kurta",
  };
  return labels[type];
}

export function garmentKey(type: GarmentType): string {
  const keys: Record<GarmentType, string> = {
    SHALWAR_QAMEEZ: "shalwarQameez",
    WAISTCOAT: "waistcoat",
    COAT: "coat",
    DRESS_PANT_COAT: "dressPantCoat",
    SHIRT_ONLY: "shirtOnly",
    DRESS_PANTS_ONLY: "dressPantsOnly",
    SHERWANI: "sherwani",
    SUIT: "suit",
    FROCK: "frock",
    KURTA: "kurta",
  };
  return keys[type];
}

export function fromGarmentType(type: GarmentType): string {
  return garmentKey(type);
}

export const DEFAULT_MEASUREMENT_UNIT: MeasurementUnit = "INCHES";

export function fromPocketOption(value?: PocketOption | null): string | undefined {
  if (!value) return undefined;
  const map: Record<PocketOption, string> = {
    NONE: "none",
    SINGLE: "single",
    DOUBLE: "double",
  };
  return map[value];
}

export function fromCollarType(value?: CollarType | null): string | undefined {
  if (!value) return undefined;
  const map: Record<CollarType, string> = {
    REGULAR: "regular",
    BAN: "ban",
    SPREAD: "spread",
    OTHER: "other",
  };
  return map[value];
}

export function fromPlacketType(value?: PlacketType | null): string | undefined {
  if (!value) return undefined;
  const map: Record<PlacketType, string> = {
    REGULAR: "regular",
    HIDDEN: "hidden",
    OTHER: "other",
  };
  return map[value];
}

export function decimalToNumber(
  value?: { toString(): string } | number | null,
): number | undefined {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
