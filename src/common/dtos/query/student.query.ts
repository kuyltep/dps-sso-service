import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from './employee.query';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StudentQueryDto extends PageQueryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  university_id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  faculty?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  speciality?: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  study_year?: number;
}
