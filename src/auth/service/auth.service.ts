import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignDto, UserPayloadDto } from '@auth/dto';

import { Users } from '@users/entity';
import { IGetUserService, PasswordManagerService } from '@users/service';

import { TYPES } from '@config/dependency-injection';

import { IAuthService } from './auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TYPES.GetUserService)
    private usersService: IGetUserService,
    @Inject(TYPES.PasswordManagerService)
    private passwordManager: PasswordManagerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<Users | undefined> {
    const user = await this.usersService.getUserByLogin(login);

    if (user && (await this.passwordManager.compareHash(pass, user.password))) {
      return user;
    }
  }

  async login(user: UserPayloadDto): Promise<SignDto> {
    return {
      accessToken: await this.jwtService.signAsync({ ...user }),
    };
  }
}
