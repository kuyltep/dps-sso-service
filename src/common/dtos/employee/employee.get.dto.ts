import { ApiProperty } from '@nestjs/swagger';

export class EmployeeGetDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  postition: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  company_id: string;
}
