import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '@shared/enums';

import { HttpBaseException } from './http-base.exception';

export class BadRequestException extends HttpBaseException {
  /**
   * Instantiate a `BadRequestException` Exception.
   *
   * @example
   * `throw new BadRequestException()`
   *
   * @param title string to inform error title.
   * @param detail string to inform error detail.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(
    title: string = HttpInternalMessages.BAD_REQUEST,
    detail?: string,
    error?: any,
    data?: any,
  ) {
    super(title, detail, HttpStatus.BAD_REQUEST, error, data);
  }
}
