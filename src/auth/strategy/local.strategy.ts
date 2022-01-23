import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserPayloadDto } from '../dto/user-payload.dto';
import { ERROR_MESSAGES } from '../constants/messages.constants';
import { TYPES } from '@config/dependency-injection';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TYPES.AuthService)
    private readonly authService: AuthService) {
    super();
  }

  async validate(login: string, password: string): Promise<UserPayloadDto> {
    const user = await this.authService.validateUser(login, password);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTHENTICATION_FAILED);
    }
    return new UserPayloadDto(user);
  }
}
