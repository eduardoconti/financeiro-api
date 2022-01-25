import { HttpStatus } from '@nestjs/common';

export class BaseException extends Error {
  constructor(
    public readonly httpStatus: HttpStatus,
    public readonly message: string,
    public readonly reason?: string,
    public readonly error?: any,
    public readonly data?: any,
  ) {
    super();

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
