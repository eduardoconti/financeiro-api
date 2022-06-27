import { HttpStatus } from '@nestjs/common';

export class ResponseDataDto {
  constructor(
    private status: HttpStatus,
    private internalMessage?: string,
    private message?: string,
  ) {}

  getStatus(): HttpStatus {
    return this.status;
  }

  getInternalMessage(): string | undefined {
    return this.internalMessage;
  }

  getMessage(): string | undefined {
    return this.message;
  }
}
