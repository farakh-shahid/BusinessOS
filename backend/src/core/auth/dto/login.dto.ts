import { IsString, MinLength } from "class-validator";

export class LoginDto {
  /** Email address or mobile number */
  @IsString()
  @MinLength(3)
  login!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
