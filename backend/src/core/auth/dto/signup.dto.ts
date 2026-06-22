import { IsString, MinLength } from "class-validator";
import { IsPakistanPhone } from "../../../common/validators/is-pakistan-phone.validator";

export class SignupDto {
  @IsString()
  @MinLength(2)
  shopName!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsPakistanPhone()
  phone!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
