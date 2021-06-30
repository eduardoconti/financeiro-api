import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PASSWORD_ERROR_MESSAGES } from 'src/shared/constants/password-messages';

@Injectable()
export class PasswordManagerService {
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
