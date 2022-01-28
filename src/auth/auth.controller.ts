import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignDto } from '@auth/dto';
import { LocalAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';
import { IAuthService } from '@auth/service';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { SUCCESS_MESSAGES } from './constants';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(TYPES.AuthService)
    private readonly authService: IAuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<SignDto>> {
    return new SuccessResponseData<SignDto>(
      await this.authService.login(user),
      HttpStatus.OK,
      SUCCESS_MESSAGES.AUTHENTICATION_SUCCESS,
    );
  }
}
