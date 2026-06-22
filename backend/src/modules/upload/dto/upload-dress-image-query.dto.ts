import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class UploadDressImageQueryDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  /** Client id for uploads before customer is saved (new-customer flow). */
  @IsOptional()
  @IsString()
  draftKey?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  suitIndex?: number;
}
