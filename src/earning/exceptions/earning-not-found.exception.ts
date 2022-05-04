import { EARNING_ERROR_MESSAGES } from '@earning/constants';

import { NotFoundException } from '@config/exceptions';

export class EarningNotFoundException extends NotFoundException {
  constructor(error?: any, data?: any) {
    super(undefined, EARNING_ERROR_MESSAGES.EARNING_NOT_FOUND, error, data);
  }
}
