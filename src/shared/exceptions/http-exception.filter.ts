import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import * as Sentry from '@sentry/node';
import { ResponseDataDto } from '../dto/response-data.dto';
import { HttpInternalMessages } from '../enums/http-internal-messages';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private sendErrorSentry(error): void {
    let errorMessage = error.message;
    if (typeof error === 'object' && error.hasOwnProperty('error')) {
      errorMessage = error.error.concat('\n', errorMessage);
    }
    Sentry.captureException(errorMessage);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as any;

    this.sendErrorSentry(errorResponse);
    const internalMessage = errorResponse.error
      ? errorResponse.error
      : HttpInternalMessages.INTERNAL_SERVER_ERROR;
    const message = errorResponse.message
      ? errorResponse.message
      : HttpInternalMessages.INTERNAL_SERVER_ERROR;
    console.log(new ResponseDataDto(status, internalMessage, message));
    response
      .status(status)
      .json(new ResponseDataDto(status, internalMessage, message));
  }
}
