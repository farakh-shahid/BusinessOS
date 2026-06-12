import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";

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
  ])
  filter?: string;

  @IsOptional()
  @IsIn([
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
}
