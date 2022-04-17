import { UnauthorizedException } from '@config/exceptions';

export class LoginUnauthorizedException extends UnauthorizedException {
  constructor(detail: string, error?: any) {
    super(undefined, detail, error);
  }
}
