import { UnauthorizedException } from '@config/exceptions';

export class LoginUnauthorizedException extends UnauthorizedException {
  constructor(reason: string, error?: any) {
    super(undefined, reason, error);
  }
}
