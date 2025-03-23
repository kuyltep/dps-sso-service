import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessFileItemDto {
  @ApiProperty({
    example: 'resume.pdf',
    description: 'Name of the file in MinIO',
  })
  fileName: string;

  @ApiProperty({ example: 'student123', description: 'Unique ID for the file' })
  id: string;
}

export class ProcessFilesDto {
  @ApiProperty({
    type: [ProcessFileItemDto],
    description: 'List of files to process',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessFileItemDto)
  files: ProcessFileItemDto[];
}
