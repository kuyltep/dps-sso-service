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
import { JwtAuthGuard } from '../guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { StudentQueryDto } from 'src/common/dtos/query/student.query';

@Controller('students')
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
  @Get('')
  public async getStudentsByUniversityId(@Query() query: StudentQueryDto) {
    return await this.studentService.getStudentsByUniversityId(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(StudentGetResponseDto),
    },
  })
  @Get('profile')
  public async getStudentProfile(@User('id') id: string) {
    console.log(id);
    return await this.studentService.getStudentProfile(id);
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

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(StudentGetResponseDto),
    },
  })
  @Patch('profile')
  public async updateStudentProfile(
    @User('id') id: string,
    @Body() updateStudentProfileDto: StudentUpdateDto,
  ) {
    return await this.studentService.updateStudentInfoByTypeId(
      updateStudentProfileDto,
      'user',
      id,
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
