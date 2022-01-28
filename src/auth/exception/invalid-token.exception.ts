import { ERROR_MESSAGES } from '@auth/constants';

import { UnauthorizedException } from '@config/exceptions';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super(undefined, ERROR_MESSAGES.TOKEN_DECODE_ERROR);
  }
}
