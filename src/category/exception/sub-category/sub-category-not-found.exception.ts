import { ERROR_MESSAGES } from '@category/constants';

import { NotFoundException } from '@config/exceptions';

export class SubCategoryNotFoundException extends NotFoundException {
  constructor(error?: any, data?: any) {
    super(undefined, ERROR_MESSAGES.SUB_CATEGORY_NOT_FOUND, error, data);
  }
}
