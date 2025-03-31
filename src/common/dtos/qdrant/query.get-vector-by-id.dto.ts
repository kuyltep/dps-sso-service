import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryGetVectorByIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
