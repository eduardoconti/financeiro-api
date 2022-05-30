import { InternalServerErrorException } from '@config/exceptions';

export class RemoveDatabaseException extends InternalServerErrorException {
  /**
   * Instantiate an `RemoveDatabaseException` Exception.
   *
   * @example
   * `throw new RemoveDatabaseException()`
   *
   * @param reason string to inform error reason.
   * @param error error object.
   * @param data data that throw the error.
   */
  constructor(reason?: string, error?: any, data?: any) {
    super('Error to remove on database', reason, error, data);
  }
}
