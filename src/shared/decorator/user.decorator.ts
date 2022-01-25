import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserPayloadInterface } from '@auth/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserPayloadInterface;
  },
);
