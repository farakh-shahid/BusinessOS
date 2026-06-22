import { IsIn, IsOptional, IsString } from "class-validator";

export class UpdateOrderStatusDto {
  @IsIn([
    "pending",
    "cutting",
    "stitching",
    "ready",
    "delivered",
    "cancelled",
  ])
  status!: string;

  /** Amount collected when marking delivered (admin) */
  @IsOptional()
  @IsString()
  paymentCollected?: string;

  @IsOptional()
  @IsString()
  paymentNote?: string;

  @IsOptional()
  @IsString()
  cuttingMasterName?: string;

  @IsOptional()
  @IsString()
  stitchingMasterName?: string;
}
