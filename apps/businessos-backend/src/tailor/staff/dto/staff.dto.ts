import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

export class CreateStaffDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @ValidateIf((dto: CreateStaffDto) => !dto.phone?.trim())
  @IsEmail()
  email?: string;

  @ValidateIf((dto: CreateStaffDto) => !dto.email?.trim())
  @IsString()
  @IsPakistanPhone()
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(["ADMIN", "STAFF", "TAILOR"])
  role!: "ADMIN" | "STAFF" | "TAILOR";
}

export class UpdateStaffDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsIn(["ADMIN", "STAFF", "TAILOR"])
  role!: "ADMIN" | "STAFF" | "TAILOR";
}
