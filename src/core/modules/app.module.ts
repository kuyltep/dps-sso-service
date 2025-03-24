import { Module } from '@nestjs/common';
import { AppController } from 'src/core/controllers/app.controller';
import { ConfigModule } from './config.module';
import { SwaggerModule } from './swagger.module';
import { HealthModule } from './health.module';
import { AuthModule } from './auth.module';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';
import { ExceptionModule } from './exception.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../services/config.service';

import { StudentModule } from './student.module';
import { EmployeeModule } from './employee.module';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResumesModule } from './resumes.module';
import { HttpModule } from './http.module';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    SwaggerModule,
    HealthModule,
    EmployeeModule,
    AuthModule,
    PrismaModule,
    UserModule,
    ResumesModule,
    ExceptionModule,
    StudentModule,
    MulterModule.register({
      storage: diskStorage({
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        signOptions: { expiresIn: configService.getExpiresIn() },
        secret: configService.getJwtSecret(),
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    {
      useClass: ErrorsInterceptor,
      provide: APP_INTERCEPTOR,
    },
  ],
})
export class AppModule {}
