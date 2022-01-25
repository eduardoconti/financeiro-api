import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class InternalServerErrorException extends HttpBaseException {
  /**
   * Instantiate an `InternalServerErrorException` Exception.
   *
   * @example
   * `throw new InternalServerErrorException()`
   *
   * @param message string to inform error message.
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    message: string = HttpInternalMessages.INTERNAL_SERVER_ERROR,
    reason?: string,
    error?: any,
    data?: any,
  ) {
    super(message, reason, HttpStatus.INTERNAL_SERVER_ERROR, error, data);
  }
}
