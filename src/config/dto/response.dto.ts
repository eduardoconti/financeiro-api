import { HttpStatus } from '@nestjs/common';

export class ResponseDTO {
  constructor(
    public readonly status: HttpStatus,
    public readonly title?: string,
  ) {}
}
