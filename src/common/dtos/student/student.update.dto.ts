import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class StudentUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  about_me: string;
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  emai: string;
  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phone_number: string;
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  birthday: Date;
}

export class StudentUpdateByAdminDto extends StudentUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  faculty: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  study_year: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  speciality: string;
}
