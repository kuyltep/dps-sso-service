import { ApiProperty } from '@nestjs/swagger';
import { UserRegisterDto } from '../user/user.register.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserLoginDto } from '../user/user.login.dto';

export class StudentRegisterDto extends UserRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  university_id: string;
}

export class StudentRegisterResponseDto extends UserLoginDto {
  @ApiProperty()
  name: string;
}
