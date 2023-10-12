import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ERROR_MESSAGES } from '@auth/constants';
import { LoginUnauthorizedException } from '@auth/exception/login-unauthorized.exception';

import {
  BaseException,
  InternalServerErrorException,
} from '@config/exceptions';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<D>(error: any, userDatabase: D) {
    if (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new InternalServerErrorException(undefined, error.message, error);
    }

    if (!userDatabase) {
      throw new LoginUnauthorizedException(
        ERROR_MESSAGES.AUTHENTICATION_FAILED,
      );
    }

    return userDatabase;
  }
}
