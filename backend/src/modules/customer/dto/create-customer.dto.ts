import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

function emptyStringToUndefined({ value }: { value: unknown }) {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsPakistanPhone()
  phone!: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(["en", "ur"])
  preferredLocale?: "en" | "ur";
}
