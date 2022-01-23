import { SignDto, UserPayloadDto } from '@auth/dto';
import { UserPayloadInterface } from '@auth/interfaces';
import { TYPES } from '@config/dependency-injection';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@users/entity';
import { IUserService, PasswordManagerService, } from '@users/service';
import { IAuthService } from './auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TYPES.UserService)
    private usersService: IUserService,
    @Inject(TYPES.PasswordManagerService)
    private passwordManager: PasswordManagerService,
    private jwtService: JwtService,
  ) { }

  async validateUser(login: string, pass: string): Promise<Users | undefined> {
    const user = await this.usersService.returnUserByLogin(login);

    if (user && (await this.passwordManager.compareHash(pass, user.password))) {
      return user;
    }

  }

  async login(user: UserPayloadDto): Promise<SignDto> {
    const payload = {
      userName: user.userName,
      userId: user.userId,
      userProfile: user.userProfile,
    } as UserPayloadInterface;
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // private decodeToken(token: string) {
  //   try {
  //     const decodedToken = this.jwtService.decode(token);
  //     if (!decodedToken) {
  //       throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_DECODE_ERROR);
  //     }
  //     return decodedToken;
  //   } catch (error) {
  //     throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_DECODE_ERROR);
  //   }
  // }
}
