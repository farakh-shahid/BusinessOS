import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

const ASSIGNABLE_STAFF_ROLES = ["STAFF", "TAILOR"] as const;
export type AssignableStaffRole = (typeof ASSIGNABLE_STAFF_ROLES)[number];

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

  @IsOptional()
  @IsString()
  @IsPakistanPhone()
  phone2?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(ASSIGNABLE_STAFF_ROLES)
  role!: AssignableStaffRole;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  specialty?: string;
}

export class UpdateStaffDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsIn(ASSIGNABLE_STAFF_ROLES)
  role!: AssignableStaffRole;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  specialty?: string;

  @IsOptional()
  @ValidateIf((dto: UpdateStaffDto) => !!dto.phone?.trim())
  @IsString()
  @IsPakistanPhone()
  phone?: string;

  @IsOptional()
  @ValidateIf((dto: UpdateStaffDto) => !!dto.phone2?.trim())
  @IsString()
  @IsPakistanPhone()
  phone2?: string;
}
