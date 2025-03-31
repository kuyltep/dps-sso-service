import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProcessTextDto {
  @ApiProperty({
    example: 'Experienced software engineer',
    description: 'Text to process',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'vacancy456', description: 'Unique ID for the text' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;
}
