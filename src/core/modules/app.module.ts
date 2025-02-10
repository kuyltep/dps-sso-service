import { Module } from '@nestjs/common';
import { AppController } from 'src/core/controllers/app.controller';
import { ConfigModule } from './config.module';
import { SwaggerModule } from './swagger.module';
import { HealthModule } from './health.module';
import { AuthModule } from './auth.module';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';
import { ExceptionModule } from './exception.module';

@Module({
  imports: [
    ConfigModule,
    SwaggerModule,
    HealthModule,
    AuthModule,
    PrismaModule,
    UserModule,
    ExceptionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
