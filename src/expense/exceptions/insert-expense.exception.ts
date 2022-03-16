import { EXPENSE_ERROR_MESSAGES } from 'src/expense/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class InsertExpenseException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, EXPENSE_ERROR_MESSAGES.EXPENSE_CREATE_ERROR, error, data);
  }
}
