import { UnauthorizedException } from '@config/exceptions';

export class PasswordHashCompareException extends UnauthorizedException {
  constructor(detail: string) {
    super(undefined, detail);
  }
}
