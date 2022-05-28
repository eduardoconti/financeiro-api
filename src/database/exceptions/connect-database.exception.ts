import { InternalServerErrorException } from '@config/exceptions';

export class ConnectDatabaseException extends InternalServerErrorException {
  /**
   * Instantiate an `ConnectDatabaseException` Exception.
   *
   * @example
   * `throw new ConnectDatabaseException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to connect database', reason, error, data);
  }
}
