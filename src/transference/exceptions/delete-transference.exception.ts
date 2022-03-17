import { InternalServerErrorException } from '@config/exceptions';

import { TRANSFERENCE_ERROR_MESSAGES } from '@transference/constants';

export class DeleteTransferenceException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      TRANSFERENCE_ERROR_MESSAGES.TRANSFERENCE_DELETE_ERROR,
      error,
      data,
    );
  }
}
