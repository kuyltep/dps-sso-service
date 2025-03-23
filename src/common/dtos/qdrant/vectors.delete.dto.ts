import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class DeleteVectorsDto {
  @ApiProperty({ example: 'resumes', description: 'Name of the collection' })
  @IsString()
  collectionName: string;

  @ApiProperty({
    example: ['student123', 'student456'],
    description: 'IDs of vectors to delete',
    type: [String],
  })
  @IsArray()
  ids: string[];
}
