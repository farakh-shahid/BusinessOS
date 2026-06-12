import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsPakistanPhone()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(["en", "ur"])
  preferredLocale?: "en" | "ur";
}
