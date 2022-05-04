import { InternalServerErrorException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';

export class FindExpenseException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(
      undefined,
      EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      error,
      data,
    );
  }
}
