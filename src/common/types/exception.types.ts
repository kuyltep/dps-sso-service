import { HttpExceptionOptions } from '@nestjs/common';

export type ExceptionMessage = string | object;

export type ExceptionCause = string | HttpExceptionOptions;
