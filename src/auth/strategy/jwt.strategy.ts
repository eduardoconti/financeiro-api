import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserPayloadInterface } from '../interfaces/user-payload.interface';
import { TokenInterface } from '../interfaces/token.interface';
import { jwtConstants } from '../constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
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
