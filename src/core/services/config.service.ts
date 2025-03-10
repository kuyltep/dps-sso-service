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

  public getMinioPort() {
    return this.nestConfigService.get<number>('MINIO_PORT');
  }

  public getMinioSsl() {
    return this.nestConfigService.get<string>('MINIO_SSL');
  }

  public getMinioEndpoint() {
    return this.nestConfigService.get<string>('MINIO_ENDPOINT');
  }
  public getMinioAccessKey() {
    return this.nestConfigService.get<string>('MINIO_ACCESS_KEY');
  }

  public getMinioSecretKey() {
    return this.nestConfigService.get<string>('MINIO_SECRET_KEY');
  }

  public getMinioBucket() {
    return this.nestConfigService.get<string>('MINIO_BUCKET');
  }
}
