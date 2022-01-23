import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { PASSWORD_ERROR_MESSAGES } from '@shared/constants';
import * as bcrypt from 'bcrypt';

import { IPasswordManagerService } from './password-mannager.service.interface';

@Injectable()
export class PasswordManagerService implements IPasswordManagerService {
  async getHash(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 15);
    } catch (err) {
      throw new ServiceUnavailableException(
        err,
        PASSWORD_ERROR_MESSAGES.GENERATE_HASH_ERROR,
      );
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    const passwordConfirm = await bcrypt.compare(password, hash);

    if (!passwordConfirm) {
      throw new UnauthorizedException(
        PASSWORD_ERROR_MESSAGES.COMPARE_HASH_AND_PASSWORD_ERROR,
      );
    }
    return passwordConfirm;
  }
}
