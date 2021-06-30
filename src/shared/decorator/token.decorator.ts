import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator((data: unknown, req: Request) => {
  const tokenWithBearer = req.headers.authorization;
  const token = tokenWithBearer.replace('Bearer ', '');
  return token;
});
