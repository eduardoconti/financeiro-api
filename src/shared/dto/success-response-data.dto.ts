import { HttpStatus } from '@nestjs/common';

import { HttpInternalMessages } from '../enums';
import { ResponseDataDto } from './response-data.dto';

export class SuccessResponseData<D> extends ResponseDataDto {
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
