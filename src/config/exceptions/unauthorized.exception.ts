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
   * @param title string to inform error title.
   * @param detail string to inform error detail.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    title: string = HttpInternalMessages.UNAUTHORIZED,
    detail?: string,
    error?: any,
    data?: any,
  ) {
    super(title, detail, HttpStatus.UNAUTHORIZED, error, data);
  }
}
