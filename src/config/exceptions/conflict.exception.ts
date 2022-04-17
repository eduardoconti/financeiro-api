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
   * @param title string to inform error title.
   * @param detail string to inform error detail.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    title: string = HttpInternalMessages.CONFLICT,
    detail?: string,
    error?: any,
    data?: any,
  ) {
    super(title, detail, HttpStatus.CONFLICT, error, data);
  }
}
