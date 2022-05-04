import { NotFoundException } from '@config/exceptions';

export class UserNotFoundException extends NotFoundException {
  constructor(detail: string, error?: any, data?: any) {
    super(undefined, detail, error, data);
  }
}
