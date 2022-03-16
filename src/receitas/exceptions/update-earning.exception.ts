import { YIELD_ERROR_MESSAGES } from '@receitas/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class UpdateEarningException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, YIELD_ERROR_MESSAGES.YIELD_UPDATE_ERROR, error, data);
  }
}
