import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PageQueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  page_number: number = 0;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  page_size: number = 30;
}

export class EmployeeQueryDto extends PageQueryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  position?: string;
}
