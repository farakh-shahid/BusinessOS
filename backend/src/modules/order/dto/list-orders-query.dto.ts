import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { DEFAULT_PAGE_SIZE } from "@business-os/shared";

export class ListOrdersQueryDto {
  @IsOptional()
  @IsIn([
    "pending",
    "cutting",
    "stitching",
    "ready",
    "delivered",
    "cancelled",
    "ready_not_delivered",
    "overdue",
    "due_today",
    "in_progress",
    "priority",
    "due_this_week",
    "booked_today",
    "booked_last_week",
  ])
  filter?: string;

  @IsOptional()
  @IsIn([
    "workflow",
    "newest",
    "due_asc",
    "due_desc",
    "booking_asc",
    "booking_desc",
    "priority",
  ])
  sort?: string;

  @IsOptional()
  @IsString()
  dueFrom?: string;

  @IsOptional()
  @IsString()
  dueTo?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

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
}
