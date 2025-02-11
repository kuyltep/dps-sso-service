import { ApiProperty } from '@nestjs/swagger';

export class StudentGetResponseDto {
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
