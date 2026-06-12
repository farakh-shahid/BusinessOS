import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdateMeasurementDto {
  @IsOptional()
  @IsString()
  garmentType?: string;

  @IsObject()
  measurements!: Record<string, string>;

  @IsObject()
  style!: Record<string, string>;
}
