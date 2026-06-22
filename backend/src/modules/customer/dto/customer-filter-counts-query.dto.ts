import { IsDateString, IsOptional, IsString } from "class-validator";

export class CustomerFilterCountsQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsDateString()
  registeredFrom?: string;

  @IsOptional()
  @IsDateString()
  registeredTo?: string;
}
