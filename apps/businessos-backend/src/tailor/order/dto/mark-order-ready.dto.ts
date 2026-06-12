import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class MarkOrderReadyDto {
  @IsOptional()
  @IsBoolean()
  sendWhatsApp?: boolean;

  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  emailNotes?: string;
}
