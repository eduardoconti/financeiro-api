import { InternalServerErrorException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';

export class UpdateExpenseException extends InternalServerErrorException {
  constructor(
    detail = EXPENSE_ERROR_MESSAGES.EXPENSE_UPDATE_ERROR,
    error?: any,
    data?: any,
  ) {
    super(undefined, detail, error, data);
  }
}
