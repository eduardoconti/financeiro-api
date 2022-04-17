import { InternalServerErrorException } from '@config/exceptions';

export class InsertUserException extends InternalServerErrorException {
  constructor(detail: string, error?: any, data?: any) {
    super(undefined, detail, error, data);
  }
}
