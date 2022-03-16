import { YIELD_ERROR_MESSAGES } from '@earning/constants';

import { NotFoundException } from '@config/exceptions';

export class EarningNotFoundException extends NotFoundException {
  constructor(error?: any, data?: any) {
    super(undefined, YIELD_ERROR_MESSAGES.YIELD_NOT_FOUND, error, data);
  }
}
