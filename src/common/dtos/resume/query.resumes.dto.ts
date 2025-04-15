import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class QueryGetResumesRecommendDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (!value) return [];
    const splitedArr = value.split(',');
    return splitedArr;
  })
  id: string[];
}
