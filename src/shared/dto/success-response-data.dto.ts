import { HttpStatus } from '@nestjs/common';
import { HttpInternalMessages } from '../enums';
import { ResponseDataDto } from './response-data.dto';

export class SuccessResponseData<D> extends ResponseDataDto {
  private data: D;

  constructor(
    data: any,
    statusCode: HttpStatus = HttpStatus.OK,
    message?: string,
    internalMessage: string = HttpInternalMessages.OK,
  ) {
    super(statusCode, internalMessage, message);
    this.data = SuccessResponseData.createData<D>(data);
  }

  private static createData<D>(objectOrData: D): D {

    return objectOrData;
  }
}
