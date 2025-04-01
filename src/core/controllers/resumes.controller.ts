import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ResumesService } from '../services/resume.service';
import { CreateResumeDto } from 'src/common/dtos/resume/resume.create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetResumeDto } from 'src/common/dtos/resume/resume.get.dto';
import {
  GetVacanciesVectors,
  QueryGetVacanciesByResumeDto,
} from 'src/common/dtos/qdrant/query.get.vacancies.dto';
import { FileValidationPipe } from '../pipes/file-validation.pipe';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ApiOperation({ summary: 'Upload a resume file and create a new resume' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        student_id: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Resume created successfully',
    type: GetResumeDto,
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(
    @UploadedFile(FileValidationPipe)
    file: Express.Multer.File,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    return await this.resumesService.createResume(
      file,
      createResumeDto.student_id,
    );
  }

  @Get(':id/vacancies')
  @ApiOperation({ summary: 'Get vacancies for resume' })
  @ApiResponse({ type: [GetVacanciesVectors] })
  @ApiParam({ name: 'id', type: String, required: true })
  async getVacanciecByResumeId(
    @Param('id') id: string,
    @Query() query: QueryGetVacanciesByResumeDto,
  ) {
    return await this.resumesService.getVacanciesByResumeId(id, query);
  }

  @ApiOperation({ summary: 'Delete a resume by ID' })
  @ApiResponse({ status: 200, description: 'Resume deleted successfully' })
  @ApiParam({ name: 'id', type: String, required: true })
  @Delete(':id')
  async deleteResume(@Param('id') id: string) {
    return await this.resumesService.deleteResume(id);
  }
}
