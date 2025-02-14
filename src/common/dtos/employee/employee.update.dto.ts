import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class EmployeeUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;
}

export class EmployeeUpdateByAdminDto extends EmployeeUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  position: string;
}
