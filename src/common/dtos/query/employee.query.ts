import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmployeeOrderByEnum } from 'src/common/enums/employee.order-by.enum';
import { OrderTypeEnum } from 'src/common/enums/order-type.enum';

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

  @ApiProperty({
    required: false,
    enum: EmployeeOrderByEnum,
  })
  @IsEnum(EmployeeOrderByEnum)
  @IsOptional()
  order_by: EmployeeOrderByEnum = EmployeeOrderByEnum.name;

  @ApiProperty({ required: false, enum: OrderTypeEnum })
  @IsEnum(OrderTypeEnum)
  @IsOptional()
  order: OrderTypeEnum = OrderTypeEnum.asc;
}
