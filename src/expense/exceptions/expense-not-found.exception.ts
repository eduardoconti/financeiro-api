import { NotFoundException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';

export class ExpenseNotFoundException extends NotFoundException {
  constructor(error?: any, data?: any) {
    super(undefined, EXPENSE_ERROR_MESSAGES.EXPENSE_NOT_FOUND, error, data);
  }
}
