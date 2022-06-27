import { WALLET_ERROR_MESSAGES } from '@wallet/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class FindWalletException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      WALLET_ERROR_MESSAGES.WALLET_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      error,
      data,
    );
  }
}
