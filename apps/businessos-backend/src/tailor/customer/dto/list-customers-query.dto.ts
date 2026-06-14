import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { DEFAULT_PAGE_SIZE } from "@business-os/tailor";
import type { CustomerListSegment } from "../customer-list-query.helper";

const CUSTOMER_SEGMENTS: CustomerListSegment[] = [
  "vip",
  "new",
  "regular",
  "has_balance",
  "has_measurements",
];

export class ListCustomersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(DEFAULT_PAGE_SIZE)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(CUSTOMER_SEGMENTS)
  segment?: CustomerListSegment;
}
