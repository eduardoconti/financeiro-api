import { ERROR_MESSAGES } from '@category/constants';

import { InternalServerErrorException } from '@config/exceptions';

export class FindSubCategoryException extends InternalServerErrorException {
  constructor(error?: any, data?: any) {
    super(undefined, ERROR_MESSAGES.SUB_CATEGORY_FIND_ERROR, error, data);
  }
}
