import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageQueryDto } from './employee.query';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StudentsOrderByEnum } from 'src/common/enums/student.order-by.enum';
import { OrderTypeEnum } from 'src/common/enums/order-type.enum';

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

  @ApiProperty({ required: false, enum: StudentsOrderByEnum })
  @IsEnum(StudentsOrderByEnum)
  @IsOptional()
  order_by: StudentsOrderByEnum = StudentsOrderByEnum.name;

  @ApiProperty({ required: false, enum: OrderTypeEnum })
  @IsOptional()
  @IsEnum(OrderTypeEnum)
  order: OrderTypeEnum = OrderTypeEnum.asc;
}
