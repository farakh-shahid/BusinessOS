import { IsString, MaxLength, MinLength } from "class-validator";

export class SendWhatsAppMessageDto {
  @IsString()
  @MinLength(7)
  phone!: string;

  @IsString()
  @MaxLength(4096)
  message!: string;
}
