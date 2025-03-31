import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MinioService } from './minio.service';
import { ProcessFileItemDto } from 'src/common/dtos/qdrant/priocess-file.dto';
import { QdrantService } from './qdrant.service';
import { ConfigService } from './config.service';
import { MinioRemoveObjectType } from 'src/common/types/minio.types';
import { QueryGetVacanciesByResumeDto } from 'src/common/dtos/qdrant/query.get.vacancies.dto';

@Injectable()
export class ResumesService {
  private minioUrl: string;
  private resumeCollections: string;
  private vacanciesCollections: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
    private readonly qdrantService: QdrantService,
    private readonly configService: ConfigService,
  ) {
    this.minioUrl = this.configService.getMinioUrl();
    this.resumeCollections = this.configService.getQdrantResumesCollection();
    this.vacanciesCollections =
      this.configService.getQdrantVacanciesCollection();
  }

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

  async getVacanciesByResumeId(
    id: string,
    query: QueryGetVacanciesByResumeDto,
  ) {
    const vacancyDataFromQdrant = await this.qdrantService.getVectorById({
      collectionName: this.resumeCollections,
      id,
    });

    const vacancies = await this.qdrantService.searchVectors({
      collectionName: this.vacanciesCollections,
      text: vacancyDataFromQdrant.payload,
      limit: query.limit,
    });

    return vacancies;
  }

  async deleteResume(id: string) {
    await this.qdrantService.deleteVectors({
      collectionName: this.resumeCollections,
      ids: [id],
    });
    const deletedResume = await this.prismaService.resume.delete({
      where: { id },
    });

    await this.minioService.deleteFile(
      deletedResume.file_url.replace(this.minioUrl, ''),
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

    const ids: string[] = [];
    const filesToDelete: MinioRemoveObjectType[] = [];

    for (const { file_url, id } of resumes) {
      ids.push(id);
      filesToDelete.push({
        name: file_url.replace(this.minioUrl, ''),
      });
    }

    await this.minioService.deleteFiles(filesToDelete);

    await this.qdrantService.deleteVectors({
      collectionName: this.resumeCollections,
      ids,
    });

    await this.prismaService.resume.deleteMany({
      where: {
        student_id: id,
      },
    });
  }

  async deleteResumesByStudentsIds(id: string[]) {
    const resumes = await this.prismaService.resume.findMany({
      where: {
        student_id: {
          in: id,
        },
      },
      select: {
        id: true,
        file_url: true,
      },
    });

    const ids: string[] = [];
    const filesToDelete: MinioRemoveObjectType[] = [];

    for (const { file_url, id } of resumes) {
      ids.push(id);
      filesToDelete.push({
        name: file_url.replace(this.minioUrl, ''),
      });
    }

    await this.minioService.deleteFiles(filesToDelete);

    await this.qdrantService.deleteVectors({
      collectionName: this.resumeCollections,
      ids,
    });

    await this.prismaService.resume.deleteMany({
      where: {
        student_id: {
          in: id,
        },
      },
    });
  }
}
