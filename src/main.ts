import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/modules/app.module';
import { ConfigService } from './core/services/config.service';
import { SwaggerModule } from './core/modules/swagger.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const swagger = app.get(SwaggerModule);
  swagger.use(app);
  swagger.config();

  const config = app.get(ConfigService);
  const port = config.getAppPort();

  app.useGlobalPipes(
    new ValidationPipe({ always: true, disableErrorMessages: true }),
  );
  await app.listen(port);
}
bootstrap();
