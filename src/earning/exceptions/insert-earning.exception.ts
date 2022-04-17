import { EARNING_ERROR_MESSAGES } from '@earning/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class InsertEarningException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, EARNING_ERROR_MESSAGES.EARNING_CREATE_ERROR, error, data);
  }
}
