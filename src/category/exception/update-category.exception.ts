import { ERROR_MESSAGES } from '@category/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class DeleteCategoryException extends InternalServerErrorException {
  constructor(
    detail = ERROR_MESSAGES.CATEGORY_DELETE_ERROR,
    error?: any,
    data?: any,
  ) {
    super(undefined, detail, error, data);
  }
}
