import { Global, Module } from '@nestjs/common';
import { ResumesController } from '../controllers/resumes.controller';
import { ResumesService } from '../services/resume.service';
import { MinioService } from '../services/minio.service';

@Global()
@Module({
  controllers: [ResumesController],
  providers: [ResumesService, MinioService],
  exports: [ResumesService],
})
export class ResumesModule {}
