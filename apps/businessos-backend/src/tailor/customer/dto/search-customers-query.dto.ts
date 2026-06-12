import { IsString, MinLength } from "class-validator";

export class SearchCustomersQueryDto {
  @IsString()
  @MinLength(2)
  q!: string;
}
