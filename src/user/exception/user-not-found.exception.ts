import { NotFoundException } from '@config/exceptions';

export class UserNotFoundException extends NotFoundException {
  constructor(reason: string, error?: any, data?: any) {
    super(undefined, reason, error, data);
  }
}
