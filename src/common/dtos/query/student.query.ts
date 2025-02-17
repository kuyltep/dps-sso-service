import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from './employee.query';
import { Transform } from 'class-transformer';

export class StudentQueryDto extends PageQueryDto {
  @IsString()
  @IsNotEmpty()
  university_id: string;

  @IsString()
  @IsOptional()
  faculty?: string;

  @IsString()
  @IsOptional()
  speciality?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  study_year?: number;
}
