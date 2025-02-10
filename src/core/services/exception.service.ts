import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ExceptionCause,
  ExceptionMessage,
} from 'src/common/types/exception.types';

@Injectable()
export class ExceptionService {
  public unauthorizedException(
    message?: ExceptionMessage,
    cause?: ExceptionCause,
  ) {
    throw new UnauthorizedException(message, cause);
  }

  public internalServerError(
    message?: ExceptionMessage,
    cause?: ExceptionCause,
  ) {
    throw new InternalServerErrorException(message, cause);
  }
}
