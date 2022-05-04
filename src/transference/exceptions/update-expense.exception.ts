import { InternalServerErrorException } from '@config/exceptions';

import { TRANSFERENCE_ERROR_MESSAGES } from '@transference/constants';

export class UpdateTransferenceException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      TRANSFERENCE_ERROR_MESSAGES.TRANSFERENCE_UPDATE_ERROR,
      error,
      data,
    );
  }
}
