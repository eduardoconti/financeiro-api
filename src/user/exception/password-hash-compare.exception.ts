import { UnauthorizedException } from '@config/exceptions';

export class PasswordHashCompareException extends UnauthorizedException {
  constructor(reason: string) {
    super(undefined, reason);
  }
}
