import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PageQueryDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  page_number: number = 0;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  page_size: number = 30;
}

export class EmployeeQueryDto extends PageQueryDto {
  @IsString()
  @IsNotEmpty()
  company_id?: string;

  @IsString()
  @IsOptional()
  position?: string;
}
