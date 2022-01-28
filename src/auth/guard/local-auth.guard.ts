import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ERROR_MESSAGES } from '@auth/constants';
import { LoginUnauthorizedException } from '@auth/exception/login-unauthorized.exception';

import { InternalServerErrorException } from '@config/exceptions';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<D>(err: any, userDatabase: D) {
    // You can throw an exception based on either "info" or "err" arguments

    if (!userDatabase) {
      throw new LoginUnauthorizedException(
        ERROR_MESSAGES.AUTHENTICATION_FAILED,
      );
    }

    if (err) {
      throw new InternalServerErrorException(undefined, undefined, err);
    }

    return userDatabase;
  }
}
