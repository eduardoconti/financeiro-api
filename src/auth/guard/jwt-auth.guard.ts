import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@config/exceptions';

import { ERROR_MESSAGES } from '../constants/messages.constants';
import { ExpiredTokenException, InvalidTokenException } from '@auth/exception';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<D>(err: any, user: D, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (info) {
      const { name } = info;
      switch (name) {
        case 'JsonWebTokenError':
          throw new InvalidTokenException();
        case 'TokenExpiredError':
          throw new ExpiredTokenException();
        case 'NotBeforeError':
          throw new UnauthorizedException(
            undefined,
            'Token not accepted (nbf)',
          );
      }
    }

    if (!user) {
      throw new UnauthorizedException(
        undefined,
        ERROR_MESSAGES.AUTHENTICATION_FAILED,
      );
    }

    if (err) {
      throw new InternalServerErrorException(undefined, undefined, err);
    }

    return user;
  }
}
