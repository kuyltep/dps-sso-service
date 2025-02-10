import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserLoginDto } from './user.login.dto';
enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  UNIVERSITY_ADMIN = 'UNIVERSITY_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
}
export class UserRegisterDto extends UserLoginDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
