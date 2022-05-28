import { InternalServerErrorException } from '@config/exceptions';

export class CommitTransactionDatabaseException extends InternalServerErrorException {
  /**
   * Instantiate an `CommitTransactionDatabaseException` Exception.
   *
   * @example
   * `throw new CommitTransactionDatabaseException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to commit transaction', reason, error, data);
  }
}
