import { InternalServerErrorException } from '@config/exceptions';

import { TRANSFERENCE_ERROR_MESSAGES } from '@transference/constants';

export class InsertTransferenceException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      TRANSFERENCE_ERROR_MESSAGES.TRANSFERENCE_CREATE_ERROR,
      error,
      data,
    );
  }
}
