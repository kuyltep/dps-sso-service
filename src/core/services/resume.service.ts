import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MinioService } from './minio.service';
import { ProcessFileItemDto } from 'src/common/dtos/qdrant/priocess-file.dto';
import { QdrantService } from './qdrant.service';
import { ConfigService } from './config.service';

@Injectable()
export class ResumesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
    private readonly qdrantService: QdrantService,
    private readonly configService: ConfigService,
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
    const deletedResume = await this.prismaService.resume.delete({
      where: { id },
    });

    await this.minioService.deleteFile(
      deletedResume.file_url.replace(this.configService.getMinioUrl(), ''),
    );

    return deletedResume;
  }

  async deleteResumesByStudentId(id: string) {
    const resumes = await this.prismaService.resume.findMany({
      where: {
        student_id: id,
      },
      select: {
        id: true,
        file_url: true,
      },
    });

    const ids = resumes.map((resume) => resume.id);

    for (const resume of resumes) {
      await this.minioService.deleteFile(
        resume.file_url.replace(this.configService.getMinioUrl(), ''),
      );
    }

    await this.qdrantService.deleteVectors({
      collectionName: this.configService.getQdrantResumesCollection(),
      ids,
    });

    await this.prismaService.resume.deleteMany({
      where: {
        student_id: id,
      },
    });
  }
}
