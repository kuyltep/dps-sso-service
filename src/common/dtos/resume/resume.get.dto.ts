import { ApiProperty } from '@nestjs/swagger';

export class GetResumeDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'https://s3.example.com/resumes/resume1.pdf',
    description: 'URL файла резюме в S3',
  })
  file_url: string;

  @ApiProperty({
    description: 'ID студента, которому принадлежит резюме',
  })
  student_id: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Дата создания резюме',
  })
  created_at: Date;
}
