import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { EmployeeGetDto } from 'src/common/dtos/employee/employee.get.dto';
import {
  EmployeeRegisterDto,
  EmployeeRegisterResponseDto,
} from 'src/common/dtos/employee/employee.register.dto';
import {
  EmployeeUpdateByAdminDto,
  EmployeeUpdateDto,
} from 'src/common/dtos/employee/employee.update.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @ApiExtraModels(
    EmployeeGetDto,
    EmployeeRegisterDto,
    EmployeeUpdateDto,
    EmployeeUpdateByAdminDto,
  )
  @ApiQuery({
    name: 'company_id',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'position',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'page_number',
    type: Number,
    required: false,
  })
  @ApiResponse({
    isArray: true,
    schema: {
      items: {
        $ref: getSchemaPath(EmployeeGetDto),
      },
    },
  })
  @Get('company')
  public async getEmployersByCompanyId(
    @Query('company_id') id: string,
    @Query('position') position: string,
    @Query('page_size') page_size: number,
    @Query('page_number') page_number: number,
  ) {
    return await this.employeeService.getEmployeersByCompanyId(
      id,
      position,
      +page_size,
      +page_number,
    );
  }

  @ApiResponse({
    schema: {
      $ref: getSchemaPath(EmployeeGetDto),
    },
  })
  @Get('/profile')
  public async getEmployeeProfile(@Request() req) {
    return await this.employeeService.getEmployeeProfile(req.user.sub);
  }

  @ApiParam({ name: 'id', type: String, required: true })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(EmployeeGetDto),
    },
  })
  @Get('/:id')
  public async getEmployeeById(@Param('id') id: string) {
    return await this.employeeService.getEmployeeById(id);
  }

  @ApiBody({
    required: true,
    schema: {
      $ref: getSchemaPath(EmployeeRegisterDto),
    },
  })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(EmployeeRegisterResponseDto),
    },
  })
  @Post('')
  public async registerEmployee(
    @Body() registerEmployeeDto: EmployeeRegisterDto,
  ) {
    return await this.employeeService.registerEmployee(registerEmployeeDto);
  }

  @ApiBody({
    schema: {
      $ref: getSchemaPath(EmployeeUpdateDto),
    },
  })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(EmployeeGetDto),
    },
  })
  @Patch('profile')
  public async updateEmployeeProfile(
    @Body() updateEmployeeDto: EmployeeUpdateDto,
    @Request() request,
  ) {
    return await this.employeeService.updateEmployeeByTypeId(
      request.user.id,
      'user',
      updateEmployeeDto,
    );
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Employee id',
  })
  @ApiBody({
    schema: {
      $ref: getSchemaPath(EmployeeUpdateDto),
    },
  })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(EmployeeGetDto),
    },
  })
  @Patch(':id')
  public async updateEmployeeById(
    @Param('id') id: string,
    @Body() updateEmployeeDto: EmployeeUpdateDto,
  ) {
    return await this.employeeService.updateEmployeeByTypeId(
      id,
      'employee',
      updateEmployeeDto,
    );
  }
}
