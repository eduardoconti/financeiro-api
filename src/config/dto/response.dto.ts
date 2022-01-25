import { HttpStatus } from '@nestjs/common';

export class ResponseDTO {
  constructor(
    public readonly httpStatus: HttpStatus,
    public readonly message?: string,
  ) {}
}
