import { YIELD_ERROR_MESSAGES } from '@receitas/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class DeleteEarningException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, YIELD_ERROR_MESSAGES.YIELD_DELETE_ERROR, error, data);
  }
}
