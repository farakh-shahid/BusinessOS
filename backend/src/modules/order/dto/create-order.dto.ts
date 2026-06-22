import { Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

class StyleSpecsDto {
  @IsOptional()
  @IsString()
  chestPocket?: string;

  @IsOptional()
  @IsString()
  sidePockets?: string;

  @IsOptional()
  @IsString()
  collar?: string;

  @IsOptional()
  @IsString()
  placket?: string;

  @IsOptional()
  @IsString()
  gera?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  [key: string]: string | undefined;
}

export class CreateMeasurementDto {
  @IsUUID()
  customerId!: string;

  @IsOptional()
  @IsString()
  garmentType?: string;

  @IsObject()
  measurements!: Record<string, string>;

  @IsObject()
  style!: Record<string, string>;
}

export class CreateOrderDto {
  @IsIn(["existing", "new"])
  customerMode!: "existing" | "new";

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsObject()
  measurements!: Record<string, string>;

  @IsOptional()
  @ValidateNested()
  @Type(() => StyleSpecsDto)
  @IsObject()
  style?: Record<string, string>;

  @IsOptional()
  @IsString()
  chestPocket?: string;

  @IsOptional()
  @IsString()
  sidePockets?: string;

  @IsOptional()
  @IsString()
  collar?: string;

  @IsOptional()
  @IsString()
  placket?: string;

  @IsOptional()
  @IsString()
  gera?: string;

  @IsOptional()
  @IsString()
  styleNotes?: string;

  @IsString()
  garmentType!: string;

  @IsOptional()
  @IsString()
  dressCode?: string;

  @IsOptional()
  @IsString()
  suitCount?: string;

  @IsOptional()
  @IsString()
  dressImageUrl?: string;

  @IsOptional()
  @IsString()
  dressImagePublicId?: string;

  @IsIn(["customer", "shop"])
  fabricSource!: "customer" | "shop";

  @IsOptional()
  @IsString()
  fabricNotes?: string;

  @IsString()
  bookingDate!: string;

  @IsString()
  deliveryDate!: string;

  @IsOptional()
  @IsString()
  advancePaid?: string;

  @IsString()
  totalPrice!: string;

  @IsOptional()
  @IsBoolean()
  isRush?: boolean;

  @IsOptional()
  @IsString()
  assignedToName?: string;
}
