import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  private readonly maxFileSize = 50 * 1024 * 1024;

  transform(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не загружены');
    }

    for (const file of files) {
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Файл ${file.originalname} имеет недопустимый формат`,
        );
      }

      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `Файл ${file.originalname} превышает допустимый размер в 50MB`,
        );
      }
    }

    return files;
  }
}
