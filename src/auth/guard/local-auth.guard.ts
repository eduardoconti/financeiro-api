import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, userDatabase, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !userDatabase) {
      throw err || new UnauthorizedException();
    }
    return userDatabase;
  }
}
