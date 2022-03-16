import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ERROR_MESSAGES } from 'src/user/constants';

import { UnauthorizedException } from '@config/exceptions';

@Injectable()
export class CheckUserRegisterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userLoggedId = req.user.userId;
    return next.handle().pipe(
      map((data) => {
        if (data?.user?.id && data.user.id !== userLoggedId) {
          throw new UnauthorizedException(
            undefined,
            ERROR_MESSAGES.RECORD_NOT_BELONG_TO_LOGGED_USER,
          );
        }
        return data;
      }),
      catchError((err) => {
        return throwError(err);
      }),
    );
  }
}
