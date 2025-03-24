import { Global, Module } from '@nestjs/common';
import { StudentController } from '../controllers/student.controller';
import { StudentService } from '../services/student.service';
import { QdrantService } from '../services/qdrant.service';

@Global()
@Module({
  controllers: [StudentController],
  providers: [StudentService, QdrantService],
  exports: [StudentService],
})
export class StudentModule {}
