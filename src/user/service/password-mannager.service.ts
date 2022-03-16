import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHashCompareException } from 'src/user/exception';

import { InternalServerErrorException } from '@config/exceptions';

import { PASSWORD_ERROR_MESSAGES } from '@shared/constants';

import { IPasswordManagerService } from './password-mannager.service.interface';

@Injectable()
export class PasswordManagerService implements IPasswordManagerService {
  async getHash(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 15);
    } catch (err) {
      throw new InternalServerErrorException(
        undefined,
        PASSWORD_ERROR_MESSAGES.GENERATE_HASH_ERROR,
        err,
      );
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    const passwordConfirm = await bcrypt.compare(password, hash);

    if (!passwordConfirm) {
      throw new PasswordHashCompareException(
        PASSWORD_ERROR_MESSAGES.COMPARE_HASH_AND_PASSWORD_ERROR,
      );
    }
    return passwordConfirm;
  }
}
