import { Global, Module } from '@nestjs/common';
import { ResumesController } from '../controllers/resumes.controller';
import { ResumesService } from '../services/resume.service';
import { MinioService } from '../services/minio.service';
import { QdrantService } from '../services/qdrant.service';

@Global()
@Module({
  controllers: [ResumesController],
  providers: [ResumesService, MinioService, QdrantService],
  exports: [ResumesService],
})
export class ResumesModule {}
