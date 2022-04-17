import { EARNING_ERROR_MESSAGES } from '@earning/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class DeleteEarningException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, EARNING_ERROR_MESSAGES.EARNING_DELETE_ERROR, error, data);
  }
}
