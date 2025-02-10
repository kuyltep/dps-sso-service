import { Global, Module } from '@nestjs/common';
import { ExceptionService } from '../services/exception.service';

@Global()
@Module({
  providers: [ExceptionService],
  exports: [ExceptionService],
})
export class ExceptionModule {}
