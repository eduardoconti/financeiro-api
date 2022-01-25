import { InternalServerErrorException } from '@config/exceptions';

export class InsertUserException extends InternalServerErrorException {
  constructor(reason: string, error?: any, data?: any) {
    super(undefined, reason, error, data);
  }
}
