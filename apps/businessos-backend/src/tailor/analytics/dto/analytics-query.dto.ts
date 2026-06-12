import { IsDateString, IsIn, IsOptional } from "class-validator";

export class AnalyticsQueryDto {
  @IsOptional()
  @IsIn(["week", "month"])
  view?: "week" | "month";

  @IsOptional()
  @IsDateString()
  anchor?: string;

  /** Focus metrics on this day (week view) or its week bucket (month view). */
  @IsOptional()
  @IsDateString()
  focus?: string;
}
