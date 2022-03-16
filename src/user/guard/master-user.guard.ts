import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserPayloadInterface } from '@auth/interfaces';

import { ERROR_MESSAGES } from 'src/user/constants';

import { UnauthorizedException } from '@config/exceptions';

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
      throw new UnauthorizedException(
        undefined,
        ERROR_MESSAGES.NOT_IS_MASTER_USER,
      );
    }
    return true;
  }
}
