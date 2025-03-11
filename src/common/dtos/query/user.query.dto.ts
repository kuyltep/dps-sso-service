import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum DeleteUsersType {
  student = 'student',
  employee = 'employee',
}

export class QueryDeleteUsers {
  @ApiProperty({ enum: DeleteUsersType })
  @IsNotEmpty()
  @IsEnum(DeleteUsersType)
  type: DeleteUsersType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
