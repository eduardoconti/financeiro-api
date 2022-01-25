import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class BadRequestException extends HttpBaseException {
  /**
   * Instantiate a `BadRequestException` Exception.
   *
   * @example
   * `throw new BadRequestException()`
   *
   * @param message string to inform error message.
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    message: string = HttpInternalMessages.BAD_REQUEST,
    reason?: string,
    error?: any,
    data?: any,
  ) {
    super(message, reason, HttpStatus.BAD_REQUEST, error, data);
  }
}
