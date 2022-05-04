import { EARNING_ERROR_MESSAGES } from '@earning/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class FindEarningException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      EARNING_ERROR_MESSAGES.EARNING_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      error,
      data,
    );
  }
}
