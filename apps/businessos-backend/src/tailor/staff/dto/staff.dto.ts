import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";

export class CreateStaffDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @ValidateIf((dto: CreateStaffDto) => !dto.phone?.trim())
  @IsEmail()
  email?: string;

  @ValidateIf((dto: CreateStaffDto) => !dto.email?.trim())
  @IsString()
  @MinLength(7)
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(["ADMIN", "STAFF"])
  role!: "ADMIN" | "STAFF";
}

export class UpdateStaffDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsIn(["ADMIN", "STAFF"])
  role!: "ADMIN" | "STAFF";
}
