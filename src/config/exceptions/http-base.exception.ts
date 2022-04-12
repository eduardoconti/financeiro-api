import { HttpStatus } from '@nestjs/common';
import { isObject } from 'class-validator';

import { ErrorResponseDTO, ValidationErrorDTO } from '@config/dto';

import { BaseException } from './base.exception';

export class HttpBaseException extends BaseException {
  private response: ErrorResponseDTO;

  constructor(
    message: string,
    reason?: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: any,
    data?: any,
  ) {
    super(status, message, reason, error, data);
    this.response = this.createResponse(error);
  }

  private createResponse = (error?: any) => {
    if (
      isObject(error) &&
      !Array.isArray(error) &&
      error instanceof ValidationErrorDTO
    ) {
      return new ErrorResponseDTO(this.message, this.reason, this.status, [
        error,
      ]);
    } else if (Array.isArray(error) && error[0] instanceof ValidationErrorDTO) {
      return new ErrorResponseDTO(
        this.message,
        this.reason,
        this.status,
        error,
      );
    }

    return new ErrorResponseDTO(this.message, this.reason, this.status);
  };

  public getResponse = () => {
    return this.response;
  };

  static isSafeError = (error: any) => {
    return error instanceof HttpBaseException;
  };
}
