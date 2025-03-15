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
        JWT_SECRET: joi.string().required(),
        EXPIRES_IN: joi.string().required(),
        MINIO_ENDPOINT: joi.string().required(),
        MINIO_PORT: joi.number().required(),
        MINIO_SECRET_KEY: joi.string().required(),
        MINIO_ACCESS_KEY: joi.string().required(),
        MINIO_SSL: joi.string().required(),
        MINIO_BUCKET: joi.string().required,
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
