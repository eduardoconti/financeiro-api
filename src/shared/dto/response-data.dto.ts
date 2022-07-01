import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ResponseDataDto {
  @ApiResponseProperty()
  status: HttpStatus;
  @ApiResponseProperty()
  internalMessage?: string;
  @ApiResponseProperty()
  message?: string;
  constructor(status: HttpStatus, internalMessage?: string, message?: string) {
    this.status = status;
    this.internalMessage = internalMessage;
    this.message = message;
  }

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
