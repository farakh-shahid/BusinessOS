import { IsString, MinLength } from "class-validator";

export class SetStaffPasswordDto {
  @IsString()
  @MinLength(8)
  password!: string;
}
