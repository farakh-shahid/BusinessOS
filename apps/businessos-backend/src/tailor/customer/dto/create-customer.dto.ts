import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(7)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(["en", "ur"])
  preferredLocale?: "en" | "ur";
}
