import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class MethodNotAllowedException extends HttpBaseException {
  /**
   * Instantiate an `MethodNotAllowedException` Exception.
   *
   * @example
   * `throw new MethodNotAllowedException()`
   *
   * @param title string to inform error title.
   * @param detail string to inform error detail.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    title: string = HttpInternalMessages.METHOD_NOT_ALLOWED,
    detail?: string,
    error?: any,
    data?: any,
  ) {
    super(title, detail, HttpStatus.METHOD_NOT_ALLOWED, error, data);
  }
}
