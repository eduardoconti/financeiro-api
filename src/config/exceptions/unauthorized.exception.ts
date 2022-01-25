import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class UnauthorizedException extends HttpBaseException {
  /**
   * Instantiate an `UnauthorizedException` Exception.
   *
   * @example
   * `throw new UnauthorizedException()`
   *
   * @param message string to inform error message.
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    message: string = HttpInternalMessages.UNAUTHORIZED,
    reason?: string,
    error?: any,
    data?: any,
  ) {
    super(message, reason, HttpStatus.UNAUTHORIZED, error, data);
  }
}
