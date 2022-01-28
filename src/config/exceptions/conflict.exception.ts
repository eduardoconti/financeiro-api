import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class ConflictException extends HttpBaseException {
  /**
   * Instantiate an `ConflictException` Exception.
   *
   * @example
   * `throw new ConflictException()`
   *
   * @param message string to inform error message.
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    message: string = HttpInternalMessages.CONFLICT,
    reason?: string,
    error?: any,
    data?: any,
  ) {
    super(message, reason, HttpStatus.CONFLICT, error, data);
  }
}
