import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MinioService } from './minio.service';
import { ProcessFileItemDto } from 'src/common/dtos/qdrant/priocess-file.dto';
import { QdrantService } from './qdrant.service';

@Injectable()
export class ResumesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
    private readonly qdrantService: QdrantService,
  ) {}

  async createResume(file: Express.Multer.File, student_id: string) {
    const fileName = await this.minioService.uploadFile(file);
    const link = this.minioService.getFileUrl(fileName);

    const resume = await this.prismaService.resume.create({
      data: {
        file_url: link,
        student_id,
      },
    });

    return { id: resume.id, fileName } as ProcessFileItemDto;
  }

  async deleteResume(id: string) {
    await this.qdrantService.deleteVectors({
      collectionName: 'resumes',
      ids: [id],
    });
    return await this.prismaService.resume.delete({
      where: { id },
    });
  }
}
