import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  StudentRegisterDto,
  StudentRegisterResponseDto,
} from 'src/common/dtos/student/student.register';
import { StudentService } from '../services/student.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { StudentGetResponseDto } from 'src/common/dtos/student/student.get.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @ApiExtraModels(
    StudentRegisterDto,
    StudentRegisterResponseDto,
    StudentGetResponseDto,
  )
  @ApiBody({
    schema: {
      $ref: getSchemaPath(StudentRegisterDto),
    },
    required: true,
  })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(StudentRegisterResponseDto),
    },
  })
  @Post('register')
  public async registerStudent(@Body() studentRegisterDto: StudentRegisterDto) {
    return await this.studentService.registerStudent(studentRegisterDto);
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'University id',
  })
  @ApiResponse({
    isArray: true,
    schema: {
      items: {
        $ref: getSchemaPath(StudentGetResponseDto),
      },
    },
  })
  @Get('university/:id')
  public async getStudentsByUniversityId(@Param('id') id: string) {
    return await this.studentService.getStudentsByUniversityId(id);
  }
}
