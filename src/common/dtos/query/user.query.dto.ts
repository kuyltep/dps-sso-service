import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum DeleteUsersType {
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

export class QueryDeleteUsersByIds {
  @ApiProperty({ enum: DeleteUsersType })
  @IsNotEmpty()
  @IsEnum(DeleteUsersType)
  type: DeleteUsersType;

  @ApiProperty({
    example: ['2', '1'],
    description: 'Array of user IDs to delete',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  ids: string[];
}
