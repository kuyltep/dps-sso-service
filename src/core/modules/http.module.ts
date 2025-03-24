import { Global, Module } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [NestHttpModule],
  exports: [NestHttpModule],
})
export class HttpModule {}
