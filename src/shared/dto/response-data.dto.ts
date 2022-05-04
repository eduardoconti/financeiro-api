import { HttpStatus } from '@nestjs/common';

export class ResponseDataDto {
  constructor(
    protected status: HttpStatus,
    protected internalMessage?: string,
    protected message?: string,
  ) {}
}
