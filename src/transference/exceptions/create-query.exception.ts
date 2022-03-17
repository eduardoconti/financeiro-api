import { InternalServerErrorException } from '@config/exceptions';

import { TRANSFERENCE_ERROR_MESSAGES } from '@transference/constants';

export class CreateQueryException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      TRANSFERENCE_ERROR_MESSAGES.TRANSFERENCE_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      error,
      data,
    );
  }
}
