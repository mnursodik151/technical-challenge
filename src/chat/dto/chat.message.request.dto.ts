import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ChatMessageRequestDto {
  @ApiProperty()
  @IsString()
  toUser: string

  @ApiProperty()
  @IsString()
  message: string
}