import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  specialty?: string;

  @IsOptional()
  @IsString()
  @IsPakistanPhone()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsPakistanPhone()
  phone2?: string;

  @ValidateIf((dto: UpdateProfileDto) => Boolean(dto.newPassword?.trim()))
  @IsString()
  @MinLength(8)
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}
