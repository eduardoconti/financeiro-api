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
   * @param title string to inform error title.
   * @param detail string to inform error detail.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    title: string = HttpInternalMessages.INTERNAL_SERVER_ERROR,
    detail?: string,
    error?: any,
    data?: any,
  ) {
    super(title, detail, HttpStatus.INTERNAL_SERVER_ERROR, error, data);
  }
}
