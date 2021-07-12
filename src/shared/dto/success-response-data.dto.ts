import { HttpStatus } from '@nestjs/common';
import { HttpInternalMessages } from '../enums';
import { ResponseDataDto } from './response-data.dto';

export class SuccessResponseData<D> extends ResponseDataDto {
  private data: D;

  constructor(
    data: any,
    internalMessage: string = HttpInternalMessages.OK,
    statusCode: HttpStatus = HttpStatus.OK,
    message?: string,
  ) {
    super(statusCode, internalMessage, message);
    this.data = SuccessResponseData.createData<D>(data);
  }

  private static createData<D>(objectOrData: D): D {

    return objectOrData;
  }
}
