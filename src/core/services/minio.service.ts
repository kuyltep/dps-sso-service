import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from './config.service';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.getMinioEndpoint(),
      port: this.configService.getMinioPort(),
      useSSL: this.configService.getMinioSsl() === 'true',
      accessKey: this.configService.getMinioAccessKey(),
      secretKey: this.configService.getMinioSecretKey(),
    });
    this.bucketName = this.configService.getMinioBucket();
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${decodeURIComponent(file.originalname).replaceAll(' ', '_')}`;
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
        'x-amz-acl': 'public-read',
        'Content-Disposition': 'inline',
      },
    );
    return fileName;
  }

  getFileUrl(fileName: string): string {
    return `http://${this.configService.getMinioEndpoint()}:${this.configService.getMinioPort()}/${this.bucketName}/${fileName}`;
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
