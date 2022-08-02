import { ERROR_MESSAGES } from '@category/constants';

import { ForbiddenException } from '@config/exceptions';

export class ForbiddenSubCategoryException extends ForbiddenException {
  constructor(error?: any, data?: any) {
    super(undefined, ERROR_MESSAGES.SUB_CATEGORY_FRBIDDEN, error, data);
  }
}
