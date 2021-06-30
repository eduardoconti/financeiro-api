import { HttpStatus } from '@nestjs/common';

export class ResponseDataDto {
  constructor(
    protected statusCode: HttpStatus,
    protected internalMessage?: string,
    protected message?: string,
  ) {}

  /**
   * @returns HttpStatus
   */
  public getStatusCode = (): HttpStatus => {
    return this.statusCode;
  };

  /**
   * @returns string
   */
  public getMessage = (): string => {
    return this.message;
  };

  /**
   * @returns string
   */
  public getInternalMessage = (): string => {
    return this.internalMessage;
  };
}
