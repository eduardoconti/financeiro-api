import { HttpStatus } from '@nestjs/common';
import { isObject } from 'class-validator';

import { ErrorResponseDTO, ValidationErrorDTO } from '@config/dto';

import { BaseException } from './base.exception';

export class HttpBaseException extends BaseException {
  private response: ErrorResponseDTO;

  constructor(
    title: string,
    detail?: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: any,
    data?: any,
  ) {
    super(status, title, detail, error, data);
    this.response = this.createResponse(error);
  }

  private createResponse = (error?: any) => {
    if (
      isObject(error) &&
      !Array.isArray(error) &&
      error instanceof ValidationErrorDTO
    ) {
      return new ErrorResponseDTO(this.title, this.detail, this.status, [
        error,
      ]);
    } else if (Array.isArray(error) && error[0] instanceof ValidationErrorDTO) {
      return new ErrorResponseDTO(this.title, this.detail, this.status, error);
    }

    return new ErrorResponseDTO(this.title, this.detail, this.status);
  };

  public getResponse = () => {
    return this.response;
  };

  static isSafeError = (error: any) => {
    return error instanceof HttpBaseException;
  };
}
