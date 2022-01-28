import { ERROR_MESSAGES } from '@category/constants';

import { ForbiddenException } from '@config/exceptions';

export class ForbiddenCategoryException extends ForbiddenException {
  constructor(error?: any, data?: any) {
    super(undefined, ERROR_MESSAGES.CATEGORY_FRBIDDEN, error, data);
  }
}
