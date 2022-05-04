import { NotFoundException } from '@config/exceptions';

import { TRANSFERENCE_ERROR_MESSAGES } from '@transference/constants';

export class TransferenceNotFoundException extends NotFoundException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      TRANSFERENCE_ERROR_MESSAGES.TRANSFERENCE_NOT_FOUND,
      error,
      data,
    );
  }
}
