import { WALLET_ERROR_MESSAGES } from '@wallet/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class UpdateWalletException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, WALLET_ERROR_MESSAGES.WALLET_DELETE_ERROR, error, data);
  }
}
