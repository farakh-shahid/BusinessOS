import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

function emptyStringToUndefined({ value }: { value: unknown }) {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @IsPakistanPhone()
  phone?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isVip?: boolean;
}
