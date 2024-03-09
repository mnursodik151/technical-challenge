import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, isNotEmpty } from "class-validator";

export class LoginRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}