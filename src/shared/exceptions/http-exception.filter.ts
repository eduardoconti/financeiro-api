import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  MethodNotAllowedException as CommonMethodNotAllowedException,
  NotFoundException as CommonNotFoundException,
  BadRequestException as CommonBadRequestException,
  HttpStatus,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { QueryFailedError } from 'typeorm';

import { ErrorResponseDTO } from '@config/dto';
import {
  BadRequestException,
  HttpBaseException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotImplementedException,
} from '@config/exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    Sentry.captureException(exception);

    if (exception instanceof CommonNotFoundException) {
      const notFoundException = new NotImplementedException();
      return response
        .status(notFoundException.httpStatus)
        .json(notFoundException.getResponse());
    }

    if (exception instanceof CommonMethodNotAllowedException) {
      const methodNotAllowedException = new MethodNotAllowedException();
      return response
        .status(methodNotAllowedException.httpStatus)
        .json(methodNotAllowedException.getResponse());
    }

    if (exception instanceof CommonBadRequestException) {
      const badRequestException = new BadRequestException(
        undefined,
        exception?.message,
      );
      return response
        .status(badRequestException.httpStatus)
        .json(badRequestException.getResponse());
    }

    if (exception instanceof HttpBaseException) {
      const errorResponse = exception.getResponse();
      const status = exception.httpStatus;

      if (exception?.error?.constructor === QueryFailedError) {
        return response
          .status(status)
          .json(
            new ErrorResponseDTO(
              exception.error.message,
              exception.error.driverError.detail,
            ),
          );
      } else {
        return response.status(status).json(errorResponse);
      }
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(new InternalServerErrorException().getResponse());
  }
}
