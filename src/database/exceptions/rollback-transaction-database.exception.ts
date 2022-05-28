import { InternalServerErrorException } from '@config/exceptions';

export class RollbackTransactionDatabaseException extends InternalServerErrorException {
  /**
   * Instantiate an `RollbackTransactionDatabaseException` Exception.
   *
   * @example
   * `throw new RollbackTransactionDatabaseException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to rollback transaction', reason, error, data);
  }
}
