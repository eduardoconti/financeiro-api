import { ConflictException } from '@config/exceptions';

export class UserLoginAlreadyExistsException extends ConflictException {
  constructor(detail: string, error?: any, data?: any) {
    super(undefined, detail, error, data);
  }
}
