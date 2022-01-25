import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { TYPES } from '@config/dependency-injection';

import { UserPayloadDto } from '../dto/user-payload.dto';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TYPES.AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(login: string, password: string): Promise<UserPayloadDto> {
    const user = await this.authService.validateUser(login, password);
    return new UserPayloadDto(user);
  }
}
