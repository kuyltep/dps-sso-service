import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { ConfigService } from 'src/core/services/config.service';
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: joi.object({
        APP_PORT: joi.number().optional().default(4001),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
