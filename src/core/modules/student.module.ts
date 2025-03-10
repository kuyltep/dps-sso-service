import { Global, Module } from '@nestjs/common';
import { StudentController } from '../controllers/student.controller';
import { StudentService } from '../services/student.service';
import { MinioService } from '../services/minio.service';

@Global()
@Module({
  controllers: [StudentController],
  providers: [StudentService, MinioService],
  exports: [StudentService],
})
export class StudentModule {}
