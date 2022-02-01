import { InternalServerErrorException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@despesas/constants';

export class InsertExpenseException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, EXPENSE_ERROR_MESSAGES.EXPENSE_CREATE_ERROR, error, data);
  }
}
