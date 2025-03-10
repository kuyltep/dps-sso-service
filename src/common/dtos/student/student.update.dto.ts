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
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  about_me: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  emai: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone_number: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  birthday: Date;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // resume: string;
}

export class StudentUpdateByAdminDto extends StudentUpdateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  faculty: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  study_year: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  speciality: string;
}
