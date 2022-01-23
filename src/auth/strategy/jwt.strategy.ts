import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TokenInterface, UserPayloadInterface } from '@auth/interfaces';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_JWT'),
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
