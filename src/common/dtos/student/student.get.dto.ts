import { ApiProperty } from '@nestjs/swagger';
import { GetResumeDto } from '../resume/resume.get.dto';

export class StudentsGetResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  about_me: string | null;
  @ApiProperty()
  emai: string | null;
  @ApiProperty()
  phone_number: string | null;
  @ApiProperty()
  birthday: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  user_id: string;
  @ApiProperty()
  university_id: string;
  @ApiProperty()
  study_year: number | null;
  @ApiProperty()
  faculty: string | null;
  @ApiProperty()
  speciality: string | null;
}

export class StudentGetResponseDto extends StudentsGetResponseDto {
  @ApiProperty({ type: [GetResumeDto] })
  resumes: GetResumeDto[];
}
