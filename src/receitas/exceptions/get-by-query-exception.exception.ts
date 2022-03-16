import { YIELD_ERROR_MESSAGES } from '@receitas/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class GetByQueryException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      YIELD_ERROR_MESSAGES.YIELD_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      error,
      data,
    );
  }
}
