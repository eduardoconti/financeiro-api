import { WALLET_ERROR_MESSAGES } from '@wallet/constants';

import { ForbiddenException } from '@config/exceptions';

export class ForbiddenWalletException extends ForbiddenException {
  constructor(error?: any, data?: any) {
    super(undefined, WALLET_ERROR_MESSAGES.WALLET_FORBIDDEN, error, data);
  }
}
