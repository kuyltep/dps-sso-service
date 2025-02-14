import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  StudentRegisterDto,
  StudentRegisterResponseDto,
} from 'src/common/dtos/student/student.register';
import { StudentService } from '../services/student.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { StudentGetResponseDto } from 'src/common/dtos/student/student.get.dto';
import {
  StudentUpdateByAdminDto,
  StudentUpdateDto,
} from 'src/common/dtos/student/student.update.dto';

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
  @Post('')
  public async registerStudent(@Body() studentRegisterDto: StudentRegisterDto) {
    return await this.studentService.registerStudent(studentRegisterDto);
  }

  @ApiQuery({
    name: 'university_id',
    type: String,
    required: true,
    description: 'University id',
  })
  @ApiQuery({
    name: 'faculty',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'study_year',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'speciality',
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
        $ref: getSchemaPath(StudentGetResponseDto),
      },
    },
  })
  @Get('university')
  public async getStudentsByUniversityId(
    @Query('university_id') id: string,
    @Query('faculty') faculty: string,
    @Query('study_year') study_year: number,
    @Query('speciality') speciality: string,
    @Query('page_number') page_number: number = 0,
    @Query('page_size') page_size: number = 30,
  ) {
    return await this.studentService.getStudentsByUniversityId(
      id,
      faculty,
      study_year,
      speciality,
      +page_number,
      +page_size,
    );
  }

  @ApiResponse({
    schema: {
      $ref: getSchemaPath(StudentGetResponseDto),
    },
  })
  @Get('profile')
  public async getStudentProfile(@Request() request) {
    return await this.studentService.getStudentProfile(request.user.sub);
  }

  @ApiParam({
    name: 'id',
    description: 'Student id',
    required: true,
    type: String,
  })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(StudentGetResponseDto),
    },
  })
  @Get('/:id')
  public async getStudentById(@Param('id') id: string) {
    return await this.studentService.getStudentById(id);
  }

  @ApiResponse({
    schema: {
      $ref: getSchemaPath(StudentGetResponseDto),
    },
  })
  @Patch('profile')
  public async updateStudentProfile(
    @Request() request,
    @Body() updateStudentProfileDto: StudentUpdateDto,
  ) {
    return await this.studentService.updateStudentInfoByTypeId(
      updateStudentProfileDto,
      'user',
      request.user.sub,
    );
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Student id ',
  })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(StudentGetResponseDto),
    },
  })
  @Patch('/:id')
  public async updateStudentInfoById(
    @Param('id') id: string,
    @Body() updateStudentInfoByAdminDto: StudentUpdateByAdminDto,
  ) {
    return await this.studentService.updateStudentInfoByTypeId(
      updateStudentInfoByAdminDto,
      'student',
      id,
    );
  }
}
