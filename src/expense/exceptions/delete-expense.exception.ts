import { InternalServerErrorException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';

export class DeleteExpenseException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, EXPENSE_ERROR_MESSAGES.EXPENSE_DELETE_ERROR, error, data);
  }
}
