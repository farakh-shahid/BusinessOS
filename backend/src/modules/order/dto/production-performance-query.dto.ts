import { IsOptional, IsString } from "class-validator";

export class ProductionPerformanceQueryDto {
  /** Booking date range start (YYYY-MM-DD) */
  @IsOptional()
  @IsString()
  from?: string;

  /** Booking date range end (YYYY-MM-DD) */
  @IsOptional()
  @IsString()
  to?: string;

  /** Filter to one staff member */
  @IsOptional()
  @IsString()
  worker?: string;
}
