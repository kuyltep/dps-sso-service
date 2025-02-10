import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserGetDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  login: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
