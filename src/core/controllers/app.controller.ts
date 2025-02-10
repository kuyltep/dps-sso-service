import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('/health')
  public getAppHealth() {
    return { message: 'ok' };
  }
}
