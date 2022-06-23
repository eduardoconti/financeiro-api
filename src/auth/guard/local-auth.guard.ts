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
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    //console.log(context.switchToHttp().getRequest().body);
    return super.canActivate(context);
  }

  handleRequest<D>(error: any, userDatabase: D) {
    // You can throw an exception based on either "info" or "error" arguments

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
