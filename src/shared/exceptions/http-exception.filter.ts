import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  MethodNotAllowedException as CommonMethodNotAllowedException,
  NotFoundException as CommonNotFoundException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

import {
  HttpBaseException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotImplementedException,
} from '@config/exceptions';

import { HttpInternalMessages } from '@shared/enums';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    //console.log(exception);
    Sentry.captureException(exception);
    //this.errorMonitoringService.captureException(exception);

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

    if (exception instanceof HttpBaseException) {
      return response
        .status(exception.httpStatus)
        .json(exception.getResponse());
    }

    return response
      .status(HttpInternalMessages.INTERNAL_SERVER_ERROR)
      .json(new InternalServerErrorException().getResponse());
  }
}
