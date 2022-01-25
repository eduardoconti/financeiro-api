import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class NotImplementedException extends HttpBaseException {
  /**
   * Instantiate an `NotImplementedException` Exception.
   *
   * @example
   * `throw new NotImplementedException()`
   *
   * @param message string to inform error message.
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    message: string = HttpInternalMessages.NOT_IMPLEMENTED,
    reason?: string,
    error?: any,
    data?: any,
  ) {
    super(message, reason, HttpStatus.NOT_IMPLEMENTED, error, data);
  }
}
