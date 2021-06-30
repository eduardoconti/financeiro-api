import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/entity/users.entity';
import { PasswordManagerService } from 'src/users/service/password-mannager.service';
import { UsersService } from 'src/users/service/users.service';
import { ERROR_MESSAGES } from '../constants/messages.constants';
import { SignDto } from '../dto/sign-in.dto';
import { UserPayloadDto } from '../dto/user-payload.dto';
import { UserPayloadInterface } from '../interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordManager: PasswordManagerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<Users> {
    const user = await this.usersService.returnUserByLogin(login);

    if (user && (await this.passwordManager.compareHash(pass, user.password))) {
      return user;
    }
    return null;
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

  decodeToken(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_DECODE_ERROR);
      }
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_DECODE_ERROR);
    }
  }
}
