import { WALLET_ERROR_MESSAGES } from '@wallet/constants';

import { NotFoundException } from '@config/exceptions';

export class WalletNotFoundException extends NotFoundException {
  constructor(error?: any, data?: any) {
    super(undefined, WALLET_ERROR_MESSAGES.WALLET_NOT_FOUND, error, data);
  }
}
