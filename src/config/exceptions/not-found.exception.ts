import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class NotFoundException extends HttpBaseException {
  /**
   * Instantiate an `NotFoundException` Exception.
   *
   * @example
   * `throw new NotFoundException()`
   *
   * @param title string to inform error title.
   * @param detail string to inform error detail.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    title: string = HttpInternalMessages.NOT_FOUND,
    detail?: string,
    error?: any,
    data?: any,
  ) {
    super(title, detail, HttpStatus.NOT_FOUND, error, data);
  }
}
