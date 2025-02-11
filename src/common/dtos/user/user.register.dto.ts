import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  UNIVERSITY_ADMIN = 'UNIVERSITY_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
}

export class UserRegisterOptionalDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  login: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;
}
export class UserRegisterDto extends UserRegisterOptionalDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
