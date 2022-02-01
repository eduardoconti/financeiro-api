import { InternalServerErrorException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@despesas/constants';

export class UpdateExpenseException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, EXPENSE_ERROR_MESSAGES.EXPENSE_UPDATE_ERROR, error, data);
  }
}
