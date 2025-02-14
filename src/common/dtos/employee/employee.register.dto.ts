import { ApiProperty } from '@nestjs/swagger';
import { UserRegisterDto } from '../user/user.register.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserLoginDto } from '../user/user.login.dto';

export class EmployeeRegisterDto extends UserRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  company_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  position: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phone_number: string;
}

export class EmployeeRegisterResponseDto extends UserLoginDto {
  @ApiProperty()
  name: string;
}
