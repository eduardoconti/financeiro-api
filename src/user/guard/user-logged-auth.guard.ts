import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from 'src/user/constants';
import { IGetUserService } from 'src/user/service';

import { TYPES } from '@config/dependency-injection';
import { UnauthorizedException } from '@config/exceptions';

@Injectable()
export class UserLoggedGuard implements CanActivate {
  constructor(
    @Inject(TYPES.GetUserService)
    private readonly getUserService: IGetUserService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: any) {
    // try {
    await this.getUserService.getUserById(request.body.user);
    // } catch (error) {}

    if (request.body.user && request.user.userId !== request.body.user) {
      throw new UnauthorizedException(
        undefined,
        ERROR_MESSAGES.USER_TOKEN_NOT_EQUALS_TO_PARAM_URL,
      );
    }
    return true;
  }
}
