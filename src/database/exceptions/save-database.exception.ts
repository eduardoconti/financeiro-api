import { InternalServerErrorException } from '@config/exceptions';

export class SaveDatabaseException extends InternalServerErrorException {
  /**
   * Instantiate an `SaveDatabaseException` Exception.
   *
   * @example
   * `throw new SaveDatabaseException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to save on database', reason, error, data);
  }
}
