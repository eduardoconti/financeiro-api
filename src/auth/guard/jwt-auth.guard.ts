import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ERROR_MESSAGES } from '../constants/messages.constants';
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
          throw new UnauthorizedException();
        case 'TokenExpiredError':
          throw new UnauthorizedException();
        case 'NotBeforeError':
          throw new UnauthorizedException(
            undefined,
            'Token not accepted (nbf)',
          );
      }
    }

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTHENTICATION_FAILED);
    }

    if (err) {
      throw new InternalServerErrorException(err);
    }

    return user;
  }
}
