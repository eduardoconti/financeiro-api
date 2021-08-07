import { HttpStatus } from '@nestjs/common';

export class ResponseDataDto {
  constructor(
    protected statusCode: HttpStatus,
    protected internalMessage?: string,
    protected message?: string,
  ) {}
}
