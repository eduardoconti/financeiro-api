import { HttpStatus } from '@nestjs/common';

export class BaseException extends Error {
  constructor(
    public readonly status: HttpStatus,
    public readonly title: string,
    public readonly detail?: string,
    public readonly error?: any,
    public readonly data?: any,
  ) {
    super();

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
