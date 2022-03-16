import { YIELD_ERROR_MESSAGES } from '@receitas/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class InsertEarningException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, YIELD_ERROR_MESSAGES.YIELD_CREATE_ERROR, error, data);
  }
}
