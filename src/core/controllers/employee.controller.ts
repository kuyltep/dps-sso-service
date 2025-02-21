import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiParam,
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
import { JwtAuthGuard } from '../guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { EmployeeQueryDto } from 'src/common/dtos/query/employee.query';

@ApiExtraModels(
  EmployeeGetDto,
  EmployeeRegisterDto,
  EmployeeUpdateDto,
  EmployeeUpdateByAdminDto,
)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiResponse({
    isArray: true,
    schema: {
      items: {
        $ref: getSchemaPath(EmployeeGetDto),
      },
    },
  })
  @Get('')
  public async getEmployersByCompanyId(@Query() query: EmployeeQueryDto) {
    return await this.employeeService.getEmployeersByCompanyId(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(EmployeeGetDto),
    },
  })
  @Get('/profile')
  public async getEmployeeProfile(@User('id') id: string) {
    return await this.employeeService.getEmployeeProfile(id);
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

  @UseGuards(JwtAuthGuard)
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
    @User('id') id: string,
  ) {
    return await this.employeeService.updateEmployeeByTypeId(
      id,
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
      $ref: getSchemaPath(EmployeeUpdateByAdminDto),
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
    @Body() updateEmployeeDto: EmployeeUpdateByAdminDto,
  ) {
    return await this.employeeService.updateEmployeeByTypeId(
      id,
      'employee',
      updateEmployeeDto,
    );
  }
}
