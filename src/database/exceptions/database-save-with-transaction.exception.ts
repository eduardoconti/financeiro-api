import { InternalServerErrorException } from '@config/exceptions';

export class DatabaseSaveWithTransactionException extends InternalServerErrorException {
  /**
   * Instantiate an `DatabaseSaveWithTransactionException` Exception.
   *
   * @example
   * `throw new DatabaseSaveWithTransactionException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to save data with transaction', reason, error, data);
  }
}
