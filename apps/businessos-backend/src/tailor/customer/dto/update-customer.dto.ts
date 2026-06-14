import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

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
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isVip?: boolean;
}
