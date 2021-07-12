import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  private initSentry(): void {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }

  private sendErrorSentry(error): void {
    this.initSentry();
    let errorMessage = error.message
    if (typeof error === 'object' && error.hasOwnProperty('error')) {
      errorMessage = error.error.concat('\n', errorMessage)
    }
    Sentry.captureException(errorMessage);
  }

  catch(exception: HttpException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse()

    this.sendErrorSentry(errorResponse);
    
    response
      .status(status)
      .json({
        statusCode: status,
        data: errorResponse
      });
  }
}