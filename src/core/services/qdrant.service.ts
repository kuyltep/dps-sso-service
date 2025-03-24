import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';
import { ProcessFilesDto } from 'src/common/dtos/qdrant/priocess-file.dto';
import { DeleteVectorsDto } from 'src/common/dtos/qdrant/vectors.delete.dto';

@Injectable()
export class QdrantService {
  private readonly qdrantBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.qdrantBaseUrl = this.configService.getQdrantServiceUrl();
  }

  async processFiles(dto: ProcessFilesDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.qdrantBaseUrl}/qdrant/process-files`,
          dto,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Process files failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteVectors(dto: DeleteVectorsDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.qdrantBaseUrl}/qdrant/delete-vectors`, {
          data: dto,
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Delete vectors failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
