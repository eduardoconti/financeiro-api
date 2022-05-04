import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class ForbiddenException extends HttpBaseException {
  /**
   * Instantiate an `ForbiddenException` Exception.
   *
   * @example
   * `throw new ForbiddenException()`
   *
   * @param title string to inform error title.
   * @param detail string to inform error detail.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    title: string = HttpInternalMessages.FORBIDDEN,
    detail?: string,
    error?: any,
    data?: any,
  ) {
    super(title, detail, HttpStatus.FORBIDDEN, error, data);
  }
}
