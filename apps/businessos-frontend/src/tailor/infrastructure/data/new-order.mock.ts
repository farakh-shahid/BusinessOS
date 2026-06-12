import {
  bookingGarmentTypes,
  emptyMeasurementsForGarment,
  emptyStyleForGarment,
  type BookingGarmentType,
} from "@business-os/tailor";

export { bookingGarmentTypes, type BookingGarmentType };

export const bookingGarmentOptions = bookingGarmentTypes.map((value) => ({
  value,
  labelKey: value as
    | "shalwarQameez"
    | "dressPantCoat"
    | "sherwani"
    | "kurta"
    | "waistcoat",
}));

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface NewOrderDraft {
  customerMode: "existing" | "new";
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  garmentType: BookingGarmentType;
  measurements: Record<string, string>;
  style: Record<string, string>;
  dressCode: string;
  suitCount: string;
  dressImageUrl: string;
  fabricSource: "customer" | "shop";
  fabricNotes: string;
  bookingDate: string;
  deliveryDate: string;
  advancePaid: string;
  totalPrice: string;
  isRush: boolean;
  assignedToName: string;
}

export const emptyNewOrderDraft = (): NewOrderDraft => ({
  customerMode: "existing",
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  garmentType: "shalwarQameez",
  measurements: emptyMeasurementsForGarment("shalwarQameez"),
  style: emptyStyleForGarment("shalwarQameez"),
  dressCode: "",
  suitCount: "1",
  dressImageUrl: "",
  fabricSource: "customer",
  fabricNotes: "",
  bookingDate: todayIsoDate(),
  deliveryDate: "",
  advancePaid: "",
  totalPrice: "",
  isRush: false,
  assignedToName: "",
});

export const MAX_DRESS_IMAGE_BYTES = 500_000;

export async function readDressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("invalid_image");
  }
  if (file.size > MAX_DRESS_IMAGE_BYTES) {
    throw new Error("image_too_large");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("read_failed"));
      }
    };
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}
