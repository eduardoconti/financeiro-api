import { ERROR_MESSAGES } from '@category/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class DeleteSubCategoryException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, ERROR_MESSAGES.SUB_CATEGORY_DELETE_ERROR, error, data);
  }
}
