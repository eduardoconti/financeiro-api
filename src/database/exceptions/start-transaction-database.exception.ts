import { InternalServerErrorException } from '@config/exceptions';

export class StartTransactionDatabaseException extends InternalServerErrorException {
  /**
   * Instantiate an `StartTransactionDatabaseException` Exception.
   *
   * @example
   * `throw new StartTransactionDatabaseException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to start transaction', reason, error, data);
  }
}
