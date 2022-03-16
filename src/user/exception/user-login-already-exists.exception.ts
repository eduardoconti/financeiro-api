import { ConflictException } from '@config/exceptions';

export class UserLoginAlreadyExistsException extends ConflictException {
  constructor(reason: string, error?: any, data?: any) {
    super(undefined, reason, error, data);
  }
}
