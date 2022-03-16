import { EXPENSE_ERROR_MESSAGES } from 'src/expense/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class CreateQueryException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      error,
      data,
    );
  }
}
