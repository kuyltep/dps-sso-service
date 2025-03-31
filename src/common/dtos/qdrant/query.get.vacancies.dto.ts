import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryGetVacanciesByResumeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number;
}

export class GetVacanciesVectors {
  @ApiProperty()
  id: string;
  @ApiProperty()
  version: number;
  @ApiProperty()
  score: number;
}
