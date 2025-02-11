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
import { AuthGuard } from '../guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../guards/roles.guard';
import { StudentModule } from './student.module';

@Module({
  imports: [
    ConfigModule,
    SwaggerModule,
    HealthModule,
    AuthModule,
    PrismaModule,
    UserModule,
    ExceptionModule,
    StudentModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        signOptions: { expiresIn: '7d' },
        secret: configService.getJwtSecret(),
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
