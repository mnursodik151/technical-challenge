import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "src/enums/gender.enum";

export class UserProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthday?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty()
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  interests?: string[];
}