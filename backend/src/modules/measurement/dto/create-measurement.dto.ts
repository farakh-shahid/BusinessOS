import { IsObject, IsOptional, IsString, IsUUID } from "class-validator";
import type { CreateMeasurementInput } from "./create-measurement.types";

export class CreateMeasurementDto implements CreateMeasurementInput {
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

export type { CreateMeasurementInput } from "./create-measurement.types";
