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
  NotFoundException,
} from '@config/exceptions';

import { HttpInternalMessages } from '@shared/enums';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    Sentry.captureException(exception);
    console.log(exception);

    if (exception instanceof CommonNotFoundException) {
      const notFoundException = new NotFoundException(
        HttpInternalMessages.NOT_FOUND,
        'Rout not found',
      );
      return response
        .status(notFoundException.status)
        .json(notFoundException.getResponse());
    }

    if (exception instanceof CommonMethodNotAllowedException) {
      const methodNotAllowedException = new MethodNotAllowedException();
      return response
        .status(methodNotAllowedException.status)
        .json(methodNotAllowedException.getResponse());
    }

    if (exception instanceof CommonBadRequestException) {
      const badRequestException = new BadRequestException(
        undefined,
        exception?.message,
      );
      return response
        .status(badRequestException.status)
        .json(badRequestException.getResponse());
    }

    if (exception instanceof HttpBaseException) {
      const errorResponse = exception.getResponse();
      const status = exception.status;
      const title = exception.title;
      if (exception?.error?.constructor === QueryFailedError) {
        return response
          .status(status)
          .json(
            new ErrorResponseDTO(
              title ?? exception.error.message,
              exception?.error?.driverError?.detail ?? exception?.detail,
            ),
          );
      }
      return response.status(status).json(errorResponse);
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(new InternalServerErrorException().getResponse());
  }
}
