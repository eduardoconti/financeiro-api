import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';

import { ERROR_MESSAGES } from '../../shared/constants/messages';

@Injectable()
export class MasterUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request.user);
  }

  async validateRequest(user: UserPayloadInterface) {
    if (user.userProfile !== 2) {
      throw new UnauthorizedException(ERROR_MESSAGES.NOT_IS_MASTER_USER);
    }
    return true;
  }
}
