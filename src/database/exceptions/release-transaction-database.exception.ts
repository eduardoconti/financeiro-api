import { InternalServerErrorException } from '@config/exceptions';

export class ReleaseTransactionDatabaseException extends InternalServerErrorException {
  /**
   * Instantiate an `ReleaseTransactionDatabaseException` Exception.
   *
   * @example
   * `throw new ReleaseTransactionDatabaseException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to release transaction', reason, error, data);
  }
}
