import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({
    example: 'student-id-123',
    description: 'ID студента, которому принадлежит резюме',
  })
  @IsString()
  @IsNotEmpty()
  student_id: string;
}
