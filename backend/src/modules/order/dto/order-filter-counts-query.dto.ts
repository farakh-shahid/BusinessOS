import { IsOptional, IsString, IsUUID } from "class-validator";

export class OrderFilterCountsQueryDto {
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
  @IsString()
  dueFrom?: string;

  @IsOptional()
  @IsString()
  dueTo?: string;
}
