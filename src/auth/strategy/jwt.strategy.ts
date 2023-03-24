import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenInterface, UserPayloadInterface } from '@auth/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (_request: any, _token: any, done: any) => {
        const secret = this.configService.getOrThrow('SECRET_JWT');
        done(null, secret);
      },
    });
  }

  async validate(payload: TokenInterface): Promise<UserPayloadInterface> {
    return {
      userName: payload.userName,
      userId: payload.userId,
      userProfile: payload.userProfile,
    } as UserPayloadInterface;
  }
}
