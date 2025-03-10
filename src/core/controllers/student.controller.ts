import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  StudentRegisterDto,
  StudentRegisterResponseDto,
} from 'src/common/dtos/student/student.register';
import { StudentService } from '../services/student.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
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
import { FileInterceptor } from '@nestjs/platform-express';

@ApiExtraModels(
  StudentRegisterDto,
  StudentRegisterResponseDto,
  StudentGetResponseDto,
  StudentUpdateDto,
)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('resume'))
  @Patch('profile')
  public async updateStudentProfile(
    @User('id') id: string,
    @Body() updateStudentProfileDto: StudentUpdateDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'pdf',
        })
        .addMaxSizeValidator({
          maxSize: 52428800,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.studentService.updateStudentInfoByTypeId(
      updateStudentProfileDto,
      'user',
      id,
      file,
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('resume'))
  @Patch('/:id')
  public async updateStudentInfoById(
    @Param('id') id: string,
    @Body() updateStudentInfoByAdminDto: StudentUpdateByAdminDto,
    @UploadedFile(
      new ParseFilePipeBuilder()

        .addMaxSizeValidator({
          maxSize: 52428800,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.studentService.updateStudentInfoByTypeId(
      updateStudentInfoByAdminDto,
      'student',
      id,
      file,
    );
  }
}
