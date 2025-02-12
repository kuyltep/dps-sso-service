import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  public getAppPort() {
    return this.nestConfigService.get<number>('APP_PORT');
  }

  public getJwtSecret() {
    return this.nestConfigService.get<string>('JWT_SECRET');
  }

  public getExpiresIn() {
    return this.nestConfigService.get<string>('EXPIRES_IN');
  }
}
