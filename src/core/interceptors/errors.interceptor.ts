import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { logger } from 'utils/logger';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        logger.error(JSON.stringify(error));

        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        if (error.response && error.response.data) {
          throw new HttpException(
            error.response.data,
            error.response.data.status || error.response.status,
          );
        } else {
          throw new HttpException('Internal Server Error', 500);
        }
      }),
    );
  }
}
