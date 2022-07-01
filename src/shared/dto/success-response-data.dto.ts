import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

import { HttpInternalMessages } from '../enums';
import { ResponseDataDto } from './response-data.dto';

export class SuccessResponseData<D> extends ResponseDataDto {
  @ApiResponseProperty()
  data: D;

  constructor(
    data: D,
    status: HttpStatus = HttpStatus.OK,
    message?: string,
    internalMessage: string = HttpInternalMessages.OK,
  ) {
    super(status, internalMessage, message);
    this.data = data;
  }
}
