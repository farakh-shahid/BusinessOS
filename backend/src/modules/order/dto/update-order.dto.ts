import { IsBoolean, IsIn, IsObject, IsOptional, IsString } from "class-validator";

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  totalPrice?: string;

  @IsOptional()
  @IsString()
  advancePaid?: string;

  @IsOptional()
  @IsString()
  dressCode?: string;

  @IsOptional()
  @IsString()
  suitCount?: string;

  @IsOptional()
  @IsString()
  garmentType?: string;

  @IsOptional()
  @IsIn(["customer", "shop"])
  fabricSource?: "customer" | "shop";

  @IsOptional()
  @IsString()
  fabricNotes?: string;

  @IsOptional()
  @IsString()
  styleNotes?: string;

  @IsOptional()
  @IsString()
  dressImageUrl?: string;

  @IsOptional()
  @IsString()
  dressImagePublicId?: string;

  @IsOptional()
  @IsBoolean()
  isRush?: boolean;

  @IsOptional()
  @IsString()
  assignedToName?: string;

  @IsOptional()
  @IsString()
  cuttingMasterName?: string;

  @IsOptional()
  @IsString()
  stitchingMasterName?: string;

  @IsOptional()
  @IsObject()
  measurements?: Record<string, string>;

  @IsOptional()
  @IsObject()
  style?: Record<string, string>;
}
