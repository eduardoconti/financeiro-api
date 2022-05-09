import { BadRequestException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';

export class UpdateInstalmentException extends BadRequestException {
  constructor(error?: any, data?: any) {
    super(undefined, EXPENSE_ERROR_MESSAGES.UPDATE_INSTALMENT, error, data);
  }
}
