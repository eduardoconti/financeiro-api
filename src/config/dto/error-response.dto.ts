import { HttpStatus } from '@nestjs/common';

import { ResponseDTO } from './response.dto';
import { ValidationErrorDTO } from './validation-error.dto';

export class ErrorResponseDTO extends ResponseDTO {
  public readonly reason?: string;
  public readonly validationErrors?: ValidationErrorDTO[];

  constructor(
    message: string,
    reason?: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    validationErrors?: ValidationErrorDTO[],
  ) {
    super(status, message);
    this.reason = reason;
    this.validationErrors = validationErrors;
  }
}
