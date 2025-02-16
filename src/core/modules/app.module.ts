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

@Module({
  imports: [
    ConfigModule,
    SwaggerModule,
    HealthModule,
    EmployeeModule,
    AuthModule,
    PrismaModule,
    UserModule,
    ExceptionModule,
    StudentModule,
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
  providers: [JwtStrategy],
})
export class AppModule {}
