import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';
import { ProcessFilesDto } from 'src/common/dtos/qdrant/priocess-file.dto';
import { DeleteVectorsDto } from 'src/common/dtos/qdrant/vectors.delete.dto';
import { ProcessTextDto } from 'src/common/dtos/qdrant/process-text.dto';
import { SearchVectorsDto } from 'src/common/dtos/qdrant/query.search-vectors.dto';
import { QueryGetVectorByIdDto } from 'src/common/dtos/qdrant/query.get-vector-by-id.dto';

@Injectable()
export class QdrantService {
  private readonly qdrantBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.qdrantBaseUrl = this.configService.getQdrantServiceUrl();
  }

  async getVectorById(dto: QueryGetVectorByIdDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.qdrantBaseUrl}/qdrant/vector`, {
          params: dto,
        }),
      );
      if (!response.data) {
        throw new BadRequestException('invalid data');
      }
      return response.data;
    } catch (error) {
      throw new BadRequestException(
        error.data?.response || 'invalid get vector by id',
      );
    }
  }

  async searchVectors(dto: SearchVectorsDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.qdrantBaseUrl}/qdrant/search-vectors`,
          dto,
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response?.data || 'Error searching');
    }
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

  async processText(dto: ProcessTextDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.qdrantBaseUrl}/qdrant/process-text`, dto),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(
        error.response?.data || 'Process text failed',
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
